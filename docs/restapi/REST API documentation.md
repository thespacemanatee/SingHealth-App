# REST API documentation
---

```
GET /tenants/{institutionId}
GET /auditFormTemplates
POST /audits
POST /images
```
## `GET /tenants/{institutionId}`
### Parameters
`institutionId`
~ Unique identifier for inst

### Sample request
```
curl GET "localhost:5000/tenants/{institutionId}"
```

### Sample success response
```
{
  "status": 200,
  "description": "success",
  "data": [
      {
        "tenantID": "rtweafcwred",
        "stallName": "Mr Bean"
      },
      {
        "tenantID": "vefvefas",
        "stallName": "Jollibean"
      }
  ]
  
}
```
### Response definitions
`tenantID`
~ Unique identifier for tenant
`stallName`
~ Name of the stall the tenant is from

## `GET /auditForms [type_of_forms]`
### Parameters
`type_of_forms`
~ Unique identifier for type of form

### Sample request
```
curl GET "localhost:5000/tenants/ [fnb_form]"
```

### Sample success response
```
{
  "status": 200,
  "description": "success",
  "data": [
  		"formID": "1234gssowpq",
  		"type": "fnb",
      {
        "question": "Question 1",
        "answers_options" : ["Yes", "No", "NA"],
        "image" : true,
        "rectification" : true,
        "remarks" : true,
      },
      {
        "question": "Question 2",
        "answers_options" : ["Yes", "No", "NA"],
        "image" : true,
        "rectification" : true,
        "remarks" : true,
      }
  ]
  
}
```
### Response definitions
`formID`
~ Unique identifier for audit form
`type`
~ Types of form - F&B (fnb), non-F&B (non_fnb) or Covid-19 (covid19)
`question`
~ Question from the form
`answer_options`
~ Options to answer the question, will be translated to checklist
`image`
~ If the staff is able to attach images for the question
`rectification`
~ If the rectification for this non-compliance is allowed
`remarks`
~ If the staff is able to add remark for this question


## `POST /audits`
### Query string parameters
auditMetadata
~ JSON containing metadata about the audit
auditForm
~ JSON containing all the QnA, photos, deadlines, remarks, etc

### Sample request
```
curl POST "localhost:5000/audits" Content-type "application/json" "{"auditMetadata":\{staffId, tenantId, institutionID,...\}, \"auditForm\": \{type, questions, id\} }"
```

### Sample response
```
{
  "status": 200,
  "description": "success"
}
```

