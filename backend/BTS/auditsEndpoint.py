from .utils import serverResponse, send_push_message
from .constants import MAX_NUM_IMAGES_PER_NC
from flask import request, make_response, jsonify
from flask_login import login_required
from pymongo.errors import DuplicateKeyError
from datetime import datetime
import iso8601

requiredPatchKeys = ["category", "index"]
allowedTenantPatchKeys = ["rectificationImages", "rectificationRemarks", "requestForExt"]

allowedStaffPatchKeys = ["rectified", "acceptedRequest", "deadline"]

def compliant(answer):
    return answer["answer"]


def percentageCompliant(ls):
    return ls.count(True) / (ls.count(False) + ls.count(True))


def createIDForFilledForm(formTemplate, metadata):
    date = metadata["date"]
    tenant = metadata["tenantID"]
    typeOfForm = formTemplate["type"]
    return date + tenant + typeOfForm


def createIDForAuditMetaData(auditMetadata):
    staffID = auditMetadata["staffID"]
    tenantID = auditMetadata["tenantID"]
    institutionID = auditMetadata["institutionID"]
    date = auditMetadata["date"]
    return staffID + tenantID + institutionID + date


def calculateAuditScore(filledAuditForms) -> float:
    for formType, filledAuditForm in filledAuditForms.items():
        if filledAuditForm["type"] == "fnb":
            c1 = percentageCompliant(list(map(
                compliant, filledAuditForm["answers"]["Professionalism and Staff Hygiene"]))) * 0.1
            c2 = percentageCompliant(list(map(
                compliant, filledAuditForm["answers"]["Housekeeping and General Cleanliness"]))) * 0.2
            c3 = percentageCompliant(
                list(map(compliant, filledAuditForm["answers"]["Food Hygiene"]))) * 0.35
            c4 = percentageCompliant(list(map(
                compliant, filledAuditForm["answers"]["Healthier Choice in line with HPB's Healthy Eating's Initiative"]))) * 0.15
            c5 = percentageCompliant(list(
                map(compliant, filledAuditForm["answers"]["Workplace Safety and Health"]))) * 0.2
            auditScore = c1 + c2 + c3 + c4 + c5

        elif filledAuditForm["type"] == "non_fnb":
            c1 = percentageCompliant(list(map(
                compliant, filledAuditForm["answers"]["Professionalism and Staff Hygiene"]))) * 0.2
            c2 = percentageCompliant(list(map(
                compliant, filledAuditForm["answers"]["Housekeeping and General Cleanliness"]))) * 0.4
            c3 = percentageCompliant(list(
                map(compliant, filledAuditForm["answers"]["Workplace Safety and Health"]))) * 0.4
            auditScore = c1 + c2 + c3

    return auditScore


def validateAuditMetadata(auditMetadata):
    # TODO: check with data base if the users are real
    try:
        date = iso8601.parse_date(auditMetadata["date"])
        return True, "Good to go"
    except:
        return False, "Please provide an ISO format for the date"


def validateFilledAuditForms(filledAuditForms):
    def validateFilledAuditForm(filledAuditForm):
        answers = filledAuditForm["questions"]
        for category, answerList in answers.items():
            for index, answer in enumerate(answerList):
                if not "answer" in answer.keys():
                    return False, category, index, "Please fill in the 'answer' field."

                if "images" in answer.keys():
                    if (numImages := len(answer.get("images", []))) > MAX_NUM_IMAGES_PER_NC:
                        return False, category, index, f"Max allowed is {MAX_NUM_IMAGES_PER_NC} images but {numImages} provided."

                    numUniqueFilenames = len(set(answer["images"]))
                    numFilenames = len(answer["images"])
                    if numFilenames > numUniqueFilenames:
                        return False, category, index, f"Duplicate filenames found."

                if not answer["answer"]:
                    if len(answer.get("remarks", [])) == 0:
                        return False, category, index, "Please fill in the remarks section"

                    if "deadline" not in answer.keys():
                        return False, category, index, "Please provide the deadline for the rectification"
                    else:
                        try:
                            date = iso8601.parse_date(answer["deadline"])
                        except:
                            return False, category, index, "Please provide an ISO format for the deadline"

        return True, "Form is valid and ready for uploading"
    
    formTypes = filledAuditForms.keys()
    if set(formTypes).issubset({"non_fnb", "fnb", "covid19"}):
        if "non_fnb" in formTypes and "fnb" in formTypes:
            return False, "Form contains conflicting types of forms: fnb & non_fnb"
    else:
        return False, "Form contains unknown form types"
    for formType, form in filledAuditForms.items():
        isValid = validateFilledAuditForm(form)
        if not isValid[0]:
            return False, isValid[1:]
    return True, "All forms are valid and ready for uploading"


def generateIDs(auditMetaData, auditForms):
    auditMetaData["auditChecklists"] = {}

    metaDataID = createIDForAuditMetaData(auditMetaData)
    auditMetaData["_id"] = metaDataID

    filledAuditForms = {}
    for formType, formTemplate in auditForms.items():
        if formTemplate == None:
            continue

        id = createIDForFilledForm(formTemplate, auditMetaData)
        formTemplate["formTemplateID"] = formTemplate["_id"]
        formTemplate["_id"] = id
        filledAuditForms[formTemplate["type"]] = formTemplate
        auditMetaData["auditChecklists"][formTemplate["type"]] = id

        # TODO: investigate further if DB structure can be flattened further for data integrity
        # This works for now because we only have 2 forms: 1 covid, 1 non-covid
        # Otherwise, maintain data integrity by writing checks on the incoming data and make sure they have only 2 specific forms
    # Add rect progress -> auditMetaData

    return auditMetaData, filledAuditForms


def postProcessLineItem(lineItem):
    # convert all time to datetime objects
    #             if answer = False, add a rectified = False
    #             rm qns
    lineItem.pop("question")

    if not lineItem["answer"]:
        lineItem["rectified"] = False
        lineItem["deadline"] = iso8601.parse_date(lineItem["deadline"])
    elif lineItem["answer"] and "rectified" in lineItem.keys():
        lineItem.pop("rectified")
    return lineItem


def post_process_filledAuditForms(filledAuditForms):
    output = {}
    for formType, filledAuditForm in filledAuditForms.items():
        filledAuditForm_cp = filledAuditForm.copy()
        filledAuditForm_cp["answers"] = filledAuditForm["questions"]
        filledAuditForm_cp.pop("questions")
        processedFilledAuditForm = {}
        for category, answerList in filledAuditForm_cp["answers"].items():
            processedAnswerList = []
            for lineItem in answerList:
                processedLineItem = postProcessLineItem(lineItem)
                processedAnswerList.append(processedLineItem)
            processedFilledAuditForm[category] = processedAnswerList
        filledAuditForm_cp["answers"] = processedFilledAuditForm
        output[formType] = filledAuditForm_cp
    return output


def post_process_AuditMetadata(auditMetadata):
    auditMetadata_cp = auditMetadata.copy()
    auditMetadata_cp['date'] = iso8601.parse_date(auditMetadata_cp['date'])
    return auditMetadata_cp


def validatePatchRequest(patches, allowedPatchKeys, requiredPatchKeys):
    for formType, patchList in patches.items():
        for patch in patchList:
            noInvalidKey = all(map(lambda x : x in allowedPatchKeys, patch.keys()))
            sufficientKeys = all(map(lambda x : x in patch.keys(), requiredPatchKeys))
            if not noInvalidKey:
                return False, "Invalid keys provided. You are trying to modify fields that are locked for modifying."

            if not sufficientKeys:
                return False, "Unable to narrow down the line item in the audit that you want to edit."
    return True, "All patches verified"

def databaseAcceptsChanges(patches, mongo, auditChecklists, allowUpdateOfRectifiedItems = False):
     # Find the audit metadata in the DB
    
    for formType, patchList in patches.items():
        try:
            formID = auditChecklists[formType]
        except KeyError:
            return serverResponse(None, 400, f"The form you were trying({formType}) to edit does not exist.")
        
        selectedAuditForm = mongo.db.filledAuditForms.find_one({"_id": formID})

        for patch in patchList:
            compliant = selectedAuditForm["answers"][patch["category"]][patch["index"]]["answer"]
            if compliant:
                msg = {
                    "formType":formType,
                    "patch": patch,
                    "description": "You can't edit a line item that is already marked as compliant" 
                    }
                return False, serverResponse(
                    msg, 
                    400, 
                    "You are editing a line item that was previously marked as compliant"
                    )

            elif not allowUpdateOfRectifiedItems:
                # Check if the particular line item has already been rectified
                category = patch["category"]
                index = patch["index"]
                answers = selectedAuditForm["answers"]
                alreadyRectified = answers[category][index].get("rectified", False)
                if alreadyRectified:
                    msg = {
                        "formType": formType,
                        "patch": patch,
                        "description": "You can't edit a line item that has already been rectified." 
                        }
                    return False, serverResponse(
                        msg, 
                        400, 
                        "You are editing a line item that has already been rectified."
                        )
    
    return True, None

def mongoUpdateGivenFields(mongo, patches, fields, auditChecklists):
    def mongoUpdateOne(mongo, formID, lineItem, patch, field):
        if patch.get(field, None) != None:
            result = mongo.db.filledAuditForms.update_one(
                {"_id": formID},
                {
                    "$set": {                               
                        lineItem + field: patch[field]
                    }
                    
                }
            )
            return result
        return None

    patchResults = []
    for formType, patchList in patches.items():
        for patch in patchList:
            formID = auditChecklists[formType]
            lineItem = "answers." + patch["category"] + "." + str(patch["index"]) + "."
            patchStatuses = []
            for field in fields:
                result = mongoUpdateOne(mongo, formID, lineItem, patch, field)
                
                try:
                    patchStatuses.append(result.acknowledged)
                except AttributeError:
                    pass
            
            patchResult = {"patch": patch, "status": all(patchStatuses)}
            patchResults.append(patchResult)
    return patchResults

def addAuditsEndpoint(app, mongo):
    @app.route("/audits", methods=['POST'])
    @login_required
    def audits():
        if request.method == 'POST':
            auditData = request.json
            auditMetaData = auditData["auditMetadata"]
            filledAuditForms = auditData["auditForms"]

            allFormsAreValid = validateFilledAuditForms(filledAuditForms)
            allMetadataAreValid = validateAuditMetadata(auditMetaData)

            if not allMetadataAreValid[0]:
                errorDescription = allMetadataAreValid[1]
                return serverResponse(None, 400, errorDescription)

            if not allFormsAreValid[0]:
                errorDescription = allFormsAreValid[1]
                return serverResponse(
                    None,
                    400,
                    f"Item no. {errorDescription[1]} in '{errorDescription[0]}':\n{errorDescription[2]}"
                    )

            auditMetaData_ID, filledAuditForms_ID = generateIDs(
                auditMetaData, 
                filledAuditForms
                )
            filledAuditForms_ID_processed = post_process_filledAuditForms(
                filledAuditForms_ID)
            auditMetaData_ID_processed = post_process_AuditMetadata(
                auditMetaData_ID)
            auditScore = calculateAuditScore(filledAuditForms_ID_processed)
            auditMetaData_ID_processed["score"] = auditScore

            if auditScore < 1:
                auditMetaData_ID_processed['rectificationProgress'] = 0

            try:
                result1 = mongo.db.audits.insert_one(
                    auditMetaData_ID_processed)

                if not result1.acknowledged:
                    return serverResponse(None, 503, "Problem uploading audit details to Database")

                for filledForm in filledAuditForms_ID_processed.values():
                    result2 = mongo.db.filledAuditForms.insert_one(filledForm)

                    if not result2.acknowledged:
                        return serverResponse(None, 503, "Problem uploading forms to Database")

            except DuplicateKeyError:
                return serverResponse(None, 400, "Form has already been uploaded")

            tenant = mongo.db.tenant.find_one({"_id": auditMetaData["tenantID"]})
            if tenant:
                for token in tenant["expoToken"]:
                    try:
                        send_push_message(token, "SingHealth Audits", "Recent audit results ready for viewing")
                    except:
                        continue
            return serverResponse(None, 200, "Forms have been submitted successfully!")

    @app.route("/audits/<auditID>", methods=['GET'])
    @login_required
    def get_audit(auditID):
        if request.method == "GET":
            responseJson = {}
            audit = mongo.db.audits.find_one({"_id": auditID})
            if audit:
                checklists = audit["auditChecklists"]
                auditForms = {}
                for formType, formID in checklists.items():
                    filledAuditForm = mongo.db.filledAuditForms.find_one(
                        {"_id": formID})
                    if not filledAuditForm:
                        return serverResponse(None, 404, f"Form not found: {formID}")

                    auditFormTemplate = mongo.db.auditFormTemplate.find_one(
                        {"_id": filledAuditForm["formTemplateID"]})
                    questions = {}
                    for category in filledAuditForm["answers"].keys():
                        categoryQuestions = []
                        for index, lineItem in enumerate(filledAuditForm["answers"][category]):
                            lineItem["question"] = auditFormTemplate["questions"][category][index]["question"]
                            categoryQuestions.append(lineItem)
                        questions[category] = categoryQuestions

                    filledAuditForm.pop("answers")
                    filledAuditForm["questions"] = questions
                    auditForms[formType] = filledAuditForm

                date = audit["date"]
                if isinstance(date, datetime):
                    audit["date"] = date.isoformat()
                responseJson["auditMetadata"] = audit
                responseJson["auditForms"] = auditForms

                return serverResponse(responseJson, 200, "Forms retrieved successfully!")

            else:

                return serverResponse(None, 404, "Form not found in our database")

    
    @app.route("/audits/<auditID>/tenant", methods=['PATCH'])
    @login_required
    def patch_audit_tenant(auditID):
        if request.method == "PATCH":
            patches = request.json
            valid, description = validatePatchRequest(
                patches, 
                allowedTenantPatchKeys + requiredPatchKeys,
                requiredPatchKeys
                )

            if not valid:
                return serverResponse(None, 400, description)
            
            selectedAudit = mongo.db.audits.find_one({"_id": auditID})
            staff = mongo.db.staff.find_one(
                {"_id": selectedAudit["staffID"]}
                )
            tenant = mongo.db.tenant.find_one(
                {"_id": selectedAudit["tenantID"]}
                )
            tenantStallName = tenant["stall"]["name"]
            staffExpoTokens = staff["expoToken"]

            auditChecklists = selectedAudit["auditChecklists"]

            changesAccepted, errorResponse = databaseAcceptsChanges(
                patches, 
                mongo, 
                auditChecklists
                )
            if not changesAccepted:
                return errorResponse

            patchResults = mongoUpdateGivenFields(
                mongo, 
                patches, 
                allowedTenantPatchKeys, 
                auditChecklists
                )
            for device in staffExpoTokens:
                try:
                    send_push_message(device, tenantStallName, "has rectified a noncompliance")
                except:
                    print("Some error detected")
                    continue
            return serverResponse(patchResults, 200, "Changes sent to the database.")

    @app.route("/audits/<auditID>/staff", methods=['PATCH'])
    @login_required
    def patch_audit_staff(auditID):
        if request.method == "PATCH":
            patches = request.json
            valid, description = validatePatchRequest(
                patches, 
                allowedStaffPatchKeys + requiredPatchKeys,
                requiredPatchKeys
                )
            if not valid:
                return serverResponse(None, 400, description)

            selectedAudit = mongo.db.audits.find_one({"_id": auditID})
            auditChecklists = selectedAudit["auditChecklists"]
            institution = selectedAudit["institutionID"]
            tenantID = selectedAudit["tenantID"]

            changesAccepted, errorResponse = databaseAcceptsChanges(
                patches,
                mongo, 
                auditChecklists, 
                True
                )
            if not changesAccepted:
                return errorResponse

            patchResults = mongoUpdateGivenFields(
                mongo,
                patches,
                allowedStaffPatchKeys,
                auditChecklists
                )
            
            # retrieve the amended audit forms again starting from auditmetadata
            allQuestions = []
            for formType, formID in auditChecklists.items():
                form = mongo.db.filledAuditForms.find_one({"_id": formID})
                for answerList in form["answers"].values():
                    allQuestions.extend(answerList)
            
            numNCs = len(list(filter(
                lambda x : x["answer"] == False, 
                allQuestions)))
            numRectifiedNCs = len(list(filter(
                lambda x : x["answer"] == False and x["rectified"] == True, 
                allQuestions)))
            percentRectification = numRectifiedNCs / numNCs


            # Update audit metadata
            percentRectDict = {"rectificationProgress": percentRectification}
            result = mongo.db.audits.update_one(
                {"_id": auditID},
                {
                    "$set": percentRectDict
                }
            )

            ack = percentRectDict.copy()
            ack["patchResults"] = patchResults
            ack["updatedRectProgress"] = result.acknowledged

            tenant = mongo.db.tenant.find_one({"_id": tenantID})
            if tenant:
                for device in tenant["expoToken"]:
                    try:
                        send_push_message(device, institution, "has reviewed your rectifications")
                    except:
                        print("Some error detected")
                        continue
            return serverResponse(
                ack, 
                200, 
                "Updates submitted successfully. "
                )

            