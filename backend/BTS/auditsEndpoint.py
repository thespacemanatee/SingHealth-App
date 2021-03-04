import json
from .utils import failureMsg


def printJ(data):
    print(json.dumps(data, indent=4, sort_keys=False))

# does not give ID to converted form


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


def createIDForFilledForm(formTemplate, metadata):
    date = metadata["date"]
    # time = metadata["time"]
    tenant = metadata["tenantID"]
    typeOfForm = formTemplate["type"]
    return date + tenant + typeOfForm


def createIDForAuditMetaData(auditMetadata):
    staffID = auditMetadata["staffID"]
    tenantID = auditMetadata["tenantID"]
    institutionID = auditMetadata["institutionID"]
    date = auditMetadata["date"]
    # time = auditMetadata["time"]
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
