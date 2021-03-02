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

