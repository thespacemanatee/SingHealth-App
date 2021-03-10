# REST API documentation
---

## Endpoints
- [x] [`GET /tenants/{institutionId}`](#`GET-/tenants/{institutionId}`)
- [ ] [`POST /tenants/{institutionId}`](#`POST-/tenants/{institutionId}`)
- [x] [`GET /auditFormTemplates`](#`GET-/auditFormTemplates`)
- [x] [`POST /audits`](#`POST-/audits`)
- [ ] [`GET /audits`](#`POST-/audits`)
- [x] [`POST /images`](#`POST-/images`)
- [ ] [`GET /images`](#`GET-/images`)
---


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

<br>
<br>

## `POST /audits`
---
### Query string parameters
`auditMetadata`
~ JSON containing metadata about the audit
`auditForms`
~ JSON containing all the QnA, photos, deadlines, remarks, etc

### Sample request
```
curl POST "localhost:5000/audits" Content-type "application/json" "{"auditMetadata":\{staffId, tenantId, institutionID,...\}, \"auditForm\": \{\"fnb\":\{type, questions, id\}\} }"
```

### Sample response
#### Success response
```
{
  "status": 200,
  "description": "Forms have successfully been uploaded"
}
```
#### Failure response
```
{
  "status": 400,
  "description": "Item at index 3 has duplicate images"
}
```

<br>
<br>

## `POST /images`
---
### JSON Query string parameters
`images`
~ An array of image objects each containing `fileName` & `uri`.
`fileName`
~ The name and file extension of the image. Must be globally unique.
`uri`
~ The actual image as a base64 string.

### Multipart/formdata parameters
Category | Name
-|-
Mimetype | `image/jpg` / `image/png`
Key | `images`

### Sample response
#### Success
```
{
  "status": 200,
  "description": "Images have successfully been uploaded"
}
```
#### Failure
```
{
  "status": 400,
  "description": "Image filenames not unique"
}
```

## `GET /images`
---
### JSON Query string parameters
`fileNames`
~ The name and file extension of the image. Must be globally unique.

### Sample request
```
{
  "filenames": [
    "image1.png",
    "image2.png",
    "image3.png"
  ]
}
```

### Sample response
#### Success
```
{
  "status": 200,
  "description": "Images have successfully been uploaded"
  "uri": [
    "image1 in base64",
    "image2 in base64",
    "image3 in base64"
  ]
}
```
#### Failure
##### Partial failure
```
{
  "status": 200,
  "description": "Image3 does not exist",
  "uri": [
    "image1 in base64",
    "image2 in base64"
  ],
  "notFound": [
    "image3 in base64"
  ]
}
```