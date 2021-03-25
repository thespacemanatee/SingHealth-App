from .utils import failureMsg, successMsg, successResponse, failureResponse
from .constants import MAX_NUM_IMAGES_PER_NC
from flask import request, make_response, jsonify
from flask_login import login_required
from pymongo.errors import DuplicateKeyError
import iso8601


def compliant(answer):
    return answer["answer"]


def percentageCompliant(ls):
    return ls.count(True) / len(ls)

# does not give ID to converted form
# TODO: Add random integer or smth to the IDs


def convertToFilledAuditForm(filledAuditFormTemplate):
    filledAuditForm = dict()
    filledAuditForm["formTemplateID"] = filledAuditFormTemplate.get("_id")
    filledAuditForm["type"] = filledAuditFormTemplate.get("type")

    # Remove all the questions from the "questions" field
    questions = filledAuditFormTemplate["questions"]
    answers = {}
    for category, answerList in questions.items():
        removedQuestion = []
        for answer in answerList:
            answer.pop("question")
            removedQuestion.append(answer)
        answers[category] = removedQuestion

    filledAuditForm["answers"] = answers

    return filledAuditForm


def validateFilledAuditForm(filledAuditForm):
    answers = filledAuditForm["answers"]
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

            if not answer["answer"] and len(answer.get("remarks", [])) == 0:
                return False, category, index, "Please fill in the remarks section"

    return True, "Form is valid and ready for uploading"


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


def convertTimeStr2UTC(filledAuditForm):
    filledAuditForm_copy = filledAuditForm.copy()
    iso = filledAuditForm_copy["answers"]
    answers = {}
    for category, answerList in iso.items():
        convertedTime = []
        for answer in answerList:
            if (deadline := answer.get("deadline", None)) != None:
                answer["deadline"] = iso8601.parse_date(deadline)
            convertedTime.append(answer)
        answers[category] = convertedTime

    filledAuditForm_copy["answers"] = answers
    return filledAuditForm_copy


def calculateAuditScore(filledAuditForm) -> float:
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


def processAuditdata(auditData):
    auditMetaData = auditData["auditMetadata"]
    auditForms = auditData["auditForms"]
    auditMetaData["auditChecklists"] = {}

    metaDataID = createIDForAuditMetaData(auditMetaData)
    auditMetaData["_id"] = metaDataID

    filledAuditForms = {}
    for formType, formTemplate in auditForms.items():
        if formTemplate == None:
            continue
        filledAuditForm_TimeStr = convertToFilledAuditForm(formTemplate)
        filledAuditForm = convertTimeStr2UTC(filledAuditForm_TimeStr)
        id = createIDForFilledForm(formTemplate, auditMetaData)
        filledAuditForm["_id"] = id
        filledAuditForms[filledAuditForm["type"]] = filledAuditForm
        auditMetaData["auditChecklists"][filledAuditForm["type"]] = id

        # TODO: investigate further if DB structure can be flattened further for data integrity
        # This works for now because we only have 2 forms: 1 covid, 1 non-covid
        # Otherwise, maintain data integrity by writing checks on the incoming data and make sure they have only 2 specific forms
        if formType != "covid19":
            auditScore = calculateAuditScore(filledAuditForm)
            auditMetaData["score"] = auditScore

    if auditScore < 1:
        auditMetaData['rectificationProgress'] = 0
    auditMetaData['date'] = iso8601.parse_date(auditMetaData['date'])
    return filledAuditForms, auditMetaData

def post_process_form(filledAuditForm):
    output = {}
    for category, answerList in filledAuditForm["answers"].items():
        newAnswerList = []
        for lineItem in answerList:
            if not lineItem["answer"]:
                lineItem["rectified"] = False
            elif lineItem["answer"] and "rectified" in lineItem.keys():
                lineItem.pop("rectified")
            newAnswerList.append(lineItem)
        output[category] = newAnswerList
    return output

def post_process_forms(filledAuditForms):
    output = {}
    for formType, formTemplate in filledAuditForms.items():
        output[formType] = post_process_form(formTemplate)
    return output
            

def validateFilledAuditForms(filledAuditForms):
    for formType, form in filledAuditForms.items():
        isValid = validateFilledAuditForm(form)
        if not isValid[0]:
            return False, isValid[1:]
    return True, "All forms are valid and ready for uploading"


def addAuditsEndpoint(app, mongo):
    @app.route("/audits", methods=['POST'])
    # @login_required
    def audits():
        if request.method == 'POST':
            auditData = request.json
            filledAuditForms, auditMetaData = processAuditdata(auditData)
            filledAuditForms = post_process_forms(filledAuditForms)
            allFormsAreValid = validateFilledAuditForms(filledAuditForms)

            if not allFormsAreValid[0]:
                errorDescription = allFormsAreValid[1]
                jsonMsg = failureMsg(errorDescription[-1], 400)
                jsonMsg["category"] = errorDescription[0]
                jsonMsg["index"] = errorDescription[1]
                return failureResponse(jsonMsg, 400)

            try:
                result1 = mongo.db.audits.insert_one(auditMetaData)

                if not result1.acknowledged:
                    return failureResponse(failureMsg("Problem uploading audit details to Database", 503), 503)

                for filledForm in filledAuditForms.values():
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
