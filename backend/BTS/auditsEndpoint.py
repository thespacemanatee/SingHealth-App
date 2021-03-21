from .utils import failureMsg, successMsg, successResponse, failureResponse
from .constants import MAX_NUM_IMAGES_PER_NC
from flask import request
from flask_login import login_required
from pymongo.errors import DuplicateKeyError

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
                return False, f"Item at index {index} does not have an 'answer' attribute"

            if "images" in answer.keys():
                if len(answer.get("images",[])) > MAX_NUM_IMAGES_PER_NC:
                    return False, f"Item at index {index} has > {MAX_NUM_IMAGES_PER_NC} images (Max is {MAX_NUM_IMAGES_PER_NC})"

                numUniqueFilenames = len(set(answer["images"]))
                numFilenames = len(answer["images"])
                if numFilenames > numUniqueFilenames:
                    return False, f"Item at index {index} has duplicate filenames"

            if not answer["answer"] and len(answer.get("remarks",[])) == 0:
                return False, f"Item at index {index} non-compliant but no remarks were given"

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


def processAuditdata(auditData):
    auditMetaData = auditData["auditMetadata"]
    auditForms = auditData["auditForms"]
    auditMetaData["auditChecklists"] = {}

    metaDataID = createIDForAuditMetaData(auditMetaData)
    auditMetaData["_id"] = metaDataID
    print(f"ID of auditMetadata: {metaDataID}")

    filledAuditForms = {}
    for formType, formTemplate in auditForms.items():
        if formTemplate == None:
            continue
        filledAuditForm = convertToFilledAuditForm(formTemplate)
        id = createIDForFilledForm(formTemplate, auditMetaData)
        print(f"ID of {formType}: {id}")
        filledAuditForm["_id"] = id
        filledAuditForms[filledAuditForm["type"]] = filledAuditForm
        auditMetaData["auditChecklists"][filledAuditForm["type"]] = id

    return filledAuditForms, auditMetaData


def validateFilledAuditForms(filledAuditForms):
    for formType, form in filledAuditForms.items():
        isValid = validateFilledAuditForm(form)
        if not isValid[0]:
            return False, f"{formType} form not valid because: {isValid[1]}"
    return True, "All forms are valid and ready for uploading"


def addAuditsEndpoint(app, mongo):
    @app.route("/audits", methods=['POST'])
    @login_required
    def audits():
        if request.method == 'POST':
            auditData = request.json
            filledAuditForms, auditMetaData = processAuditdata(auditData)
            allFormsAreValid = validateFilledAuditForms(filledAuditForms)

            if not allFormsAreValid[0]:
                return failureResponse(failureMsg(allFormsAreValid[1], 400), 400)

            try:
                mongo.db.audits.insert_one(auditMetaData)
                for filledForm in filledAuditForms.values():
                    mongo.db.filledAuditForms.insert_one(filledForm)
            except DuplicateKeyError:
                return failureResponse(failureMsg("Form has already been uploaded", 400), 400)

            return successResponse(successMsg("Forms have been submitted"))
