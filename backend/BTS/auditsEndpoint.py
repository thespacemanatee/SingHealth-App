import json
from .utils import failureMsg
from .constants import MAX_NUM_IMAGES_PER_NC

def printJ(data):
    print(json.dumps(data, indent=4, sort_keys=False))

# does not give ID to converted form




# TODO: Add form checking in compliance to json schema
# TODO: Add random integer or smth to the IDs
def convertToFilledAuditForm(filledAuditFormTemplate):
    filledAuditForm = dict()
    filledAuditForm["formTemplateID"] = filledAuditFormTemplate.get("_id")
    filledAuditForm["type"] = filledAuditFormTemplate.get("type")

    # Remove all the questions from the "questions" field
    questions = filledAuditFormTemplate["questions"]
    answers = []
    for question in questions:
        question.pop("question")
        answers.append(question)

    filledAuditForm["answers"] = answers

    return filledAuditForm

def validateFilledAuditForm(filledAuditForm):
    answers = filledAuditForm["answers"]
    for index, answer in enumerate(answers):
        if not "answer" in answer.keys():
            return False, f"Item at index {index} does not have an 'answer' attribute"
        
        if "images" in answer.keys():
            if len(answer["images"]) > MAX_NUM_IMAGES_PER_NC:
                return False, f"Item at index {index} has > {MAX_NUM_IMAGES_PER_NC} images (Max is {MAX_NUM_IMAGES_PER_NC})"

            numUniqueFilenames = len(list(set(answer["images"])))
            numFilenames = len(answer["images"])
            if numFilenames > numUniqueFilenames:
                return False, f"Item at index {index} has duplicate filenames"

        if not answer["answer"] and len(answer["remarks"]) == 0:
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

    auditMetaData["_id"] = createIDForAuditMetaData(auditMetaData)

    filledAuditForms = {}
    for formType, formTemplate in auditForms.items():
        if formTemplate == None:
            continue
        filledAuditForm = convertToFilledAuditForm(formTemplate)
        id = createIDForFilledForm(formTemplate, auditMetaData)
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
