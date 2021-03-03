import json
	

def printJ(data):
	print(json.dumps(data, indent = 4, sort_keys=False))

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

def createIDfromForms(formTemplate, metadata):
	date = metadata["date"]
	time = metadata["time"]
	tenant = metadata["tenantID"]
	typeOfForm = formTemplate["type"]
	return date + time + tenant + typeOfForm

def processAuditdata(auditData):
	auditMetaData = auditData["auditMetadata"]
	auditForms = auditData["auditForms"]

	
	filledAuditForms = {}
	for formType, formTemplate in auditForms.items():
		filledAuditForm = convertToFilledAuditForm(formTemplate)
		id = createIDfromForms(formTemplate, auditMetaData)
		filledAuditForm["_id"] = id
		filledAuditForms[filledAuditForm["type"]] = filledAuditForm
		auditMetaData["auditChecklists"][filledAuditForm["type"]] = id
	

	return filledAuditForms , auditMetaData  