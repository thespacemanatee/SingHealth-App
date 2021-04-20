from .utils import serverResponse, send_push_message, send_email_notif
from .constants import MAX_NUM_IMAGES_PER_NC, SGT_TIMEZONE
from flask import request
from .rectificationEndpoints import percentageRectification
from flask_login import login_required
from pymongo.errors import DuplicateKeyError
from datetime import datetime
from pytz import timezone
import iso8601


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

def FNBscore(filledAuditForm) -> float:
    c1 = percentageCompliant(list(map(
        compliant, filledAuditForm["answers"]["Professionalism and Staff Hygiene"]))) * 0.1
    c2 = percentageCompliant(list(map(
        compliant, filledAuditForm["answers"]["Housekeeping and General Cleanliness"]))) * 0.2
    c3 = percentageCompliant(list(map(
        compliant, filledAuditForm["answers"]["Food Hygiene"]))) * 0.35
    c4 = percentageCompliant(list(map(
        compliant, filledAuditForm["answers"]["Healthier Choice in line with HPB's Healthy Eating's Initiative"]))) * 0.15
    c5 = percentageCompliant(list(
        map(compliant, filledAuditForm["answers"]["Workplace Safety and Health"]))) * 0.2
    auditScore = c1 + c2 + c3 + c4 + c5
    return auditScore

def non_FNBscore(filledAuditForm) -> float:
    c1 = percentageCompliant(list(map(
        compliant, filledAuditForm["answers"]["Professionalism and Staff Hygiene"]))) * 0.2
    c2 = percentageCompliant(list(map(
        compliant, filledAuditForm["answers"]["Housekeeping and General Cleanliness"]))) * 0.4
    c3 = percentageCompliant(list(
        map(compliant, filledAuditForm["answers"]["Workplace Safety and Health"]))) * 0.4
    auditScore = c1 + c2 + c3
    return auditScore

def calculateAuditScore(filledAuditForms) -> float:
    for formType, filledAuditForm in filledAuditForms.items():
        if filledAuditForm["type"] == "fnb":
            auditScore = FNBscore(filledAuditForm)

        elif filledAuditForm["type"] == "non_fnb":
            auditScore = non_FNBscore(filledAuditForm)

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
                if "answer" not in answer.keys():
                    return False, category, index + 1, "Answer not provided"
                if "images" in answer.keys():
                    if (numImages := len(answer.get("images", []))) > MAX_NUM_IMAGES_PER_NC:
                        return False, category, index + 1, f"Max allowed is {MAX_NUM_IMAGES_PER_NC} images but {numImages} provided."

                    numUniqueFilenames = len(set(answer["images"]))
                    numFilenames = len(answer["images"])
                    if numFilenames > numUniqueFilenames:
                        return False, category, index + 1, "Duplicate filenames found."

                if answer["answer"] == False:
                    if len(answer.get("remarks", [])) == 0:
                        return False, category, index + 1, "Please fill in the remarks section"

                    if "deadline" not in answer.keys():
                        return False, category, index + 1, "Please provide the deadline for the rectification"
                    else:
                        try:
                            iso8601.parse_date(answer["deadline"])
                        except:
                            return False, category, index + 1, "Please provide an ISO format for the deadline"

        return True, "Form is valid and ready for uploading"

    formTypes = filledAuditForms.keys()
    if set(formTypes).issubset({"non_fnb", "fnb", "covid19"}):
        if "non_fnb" in formTypes and "fnb" in formTypes:
            return False, "Form contains conflicting types of forms: fnb & non_fnb"
    else:
        return False, "Form contains unknown form types"
    for form in filledAuditForms.values():
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
    if "question" in lineItem.keys():
        lineItem.pop("question")

    if lineItem["answer"] == False:
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
    @app.route("/audits", methods=['POST', 'GET'])
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
                allAnswers = []
                for filledAuditForm in filledAuditForms_ID_processed.values():
                    for answerList in filledAuditForm["answers"].values():
                        allAnswers.extend(answerList)
                percentRect = percentageRectification(allAnswers)

                if percentRect < 1:
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
                return serverResponse(
                    None, 
                    400, 
                    "Form has already been uploaded"
                    )

            tenant = mongo.db.tenant.find_one(
                {"_id": auditMetaData["tenantID"]})
            if tenant:
                if (expoTokens := tenant.get("expoToken")) != None:
                    for token in expoTokens:
                        try:
                            send_push_message(
                                token, "SingHealth Audits", "Recent audit results ready for viewing")
                        except:
                            continue

                date = auditMetaData_ID_processed['date']
                if date.tzinfo is None or date.tzinfo.utcoffset(date) is None:
                    date = timezone(SGT_TIMEZONE).localize(date)

                send_email_notif(
                    app,
                    tenant["email"],
                    "Audit Results",
                    f"""Dear {tenant["name"]},
                        Your recent audit results dated {date.strftime('%d %B %Y, %I:%M %p')} are ready for reviewing. Please check your app for details.
                        This email is auto generated. No signature is required.
                        You do not have to reply to this email."""
                )

                notif = {
                    "userID": tenant["_id"],
                    "auditID": auditMetaData_ID_processed["_id"],
                    "stallName": tenant["stallName"],
                    "type": "post",
                    "message": f"New audit on {date.strftime('%d/%m/%Y')} ready for viewing."
                    }

                result = mongo.db.notifications.insert_one(notif)
                if not result.acknowledged:
                    print("Failed to add POST nofitication to DB")
            return serverResponse(
                None, 
                200, 
                "Forms have been submitted successfully!"
                )
        elif request.method == "GET":
            daysBefore = int(request.args.get("daysBefore", 0))
            tenantID = request.args.get("tenantID", None)
            if tenantID == None:
                return serverResponse(None, 400, "No tenant ID provided")

            if daysBefore < 0:
                return serverResponse(None, 400, "Invalid date range provided")
            elif daysBefore == 0:
                queryDict = {"tenantID": tenantID}
            else:
                queryDict = {
                    "tenantID": tenantID,
                    "date": {
                        "$gt": datetime.utcnow() - datetime.timedelta(days=daysBefore)
                    }
                }

            audits = mongo.db.audits.find(queryDict)
            auditsList = []
            if audits != None:
                for audit in audits:
                    tenant = mongo.db.tenant.find_one(
                        {"_id": tenantID},
                        {
                            "stallName": 1
                        }
                    )
                    if tenant:
                        auditsList.append(
                            {
                                "auditMetadata": audit,
                                "stallName": tenant["stallName"]
                            }
                        )
            if len(auditsList) == 0:
                msg = "No audits found"
            else:
                msg = "Audits retrieved successfully"
            return serverResponse(auditsList, 200, msg)

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

                responseJson["auditMetadata"] = audit
                responseJson["auditForms"] = auditForms

                return serverResponse(responseJson, 200, "Forms retrieved successfully!")

            else:

                return serverResponse(None, 404, "Form not found in our database")
