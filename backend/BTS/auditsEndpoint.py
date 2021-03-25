from .utils import failureMsg, successMsg, successResponse, failureResponse
from .constants import MAX_NUM_IMAGES_PER_NC
from flask import request, make_response, jsonify
from flask_login import login_required
from pymongo.errors import DuplicateKeyError
import iso8601
import pprint


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
    #TODO: check with data base if the users are real
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


def addAuditsEndpoint(app, mongo):
    @app.route("/audits", methods=['POST'])
    # @login_required
    def audits():
        if request.method == 'POST':
            auditData = request.json
            auditMetaData = auditData["auditMetadata"]
            filledAuditForms = auditData["auditForms"]


            allFormsAreValid = validateFilledAuditForms(filledAuditForms)
            allMetadataAreValid = validateAuditMetadata(auditMetaData)

            if not allMetadataAreValid[0]:
                errorDescription = allMetadataAreValid[1]
                return failureResponse(failureMsg(errorDescription, 400), 400)

            if not allFormsAreValid[0]:
                errorDescription = allFormsAreValid[1]
                jsonMsg = failureMsg(errorDescription[-1], 400)
                jsonMsg["category"] = errorDescription[0]
                jsonMsg["index"] = errorDescription[1]
                return failureResponse(jsonMsg, 400)


            auditMetaData_ID, filledAuditForms_ID = generateIDs(auditMetaData, filledAuditForms)

            filledAuditForms_ID_processed = post_process_filledAuditForms(filledAuditForms_ID)
            auditMetaData_ID_processed = post_process_AuditMetadata(auditMetaData_ID)
            auditScore = calculateAuditScore(filledAuditForms_ID_processed)
            auditMetaData_ID_processed["score"] = auditScore
            if auditScore < 1:
                auditMetaData_ID_processed['rectificationProgress'] = 0

            pp = pprint.PrettyPrinter(indent=4)
            pp.pprint(auditMetaData_ID_processed)
            print()
            pp.pprint(filledAuditForms_ID_processed)
            try:
                result1 = mongo.db.audits.insert_one(auditMetaData_ID_processed)

                if not result1.acknowledged:
                    return failureResponse(failureMsg("Problem uploading audit details to Database", 503), 503)

                for filledForm in filledAuditForms_ID_processed.values():
                    result2 = mongo.db.filledAuditForms.insert_one(filledForm)

                    if not result2.acknowledged:
                        return failureResponse(failureMsg("Problem uploading forms to Database", 503), 503)

            except DuplicateKeyError:
                return failureResponse(failureMsg("Form has already been uploaded", 400), 400)

            return successResponse(successMsg("Forms have been submitted"))

    @app.route("/audits/<auditID>", methods=['GET'])
    # @login_required
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
                        msg = {"description": "form not found", "status": 404}
                        return make_response(jsonify(msg), 404)
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

                responseJson["auditMetadata"] = audit
                responseJson["auditForms"] = auditForms

                return make_response(jsonify(responseJson), 200)

            else:

                return make_response(jsonify(description="None found"), 404)
