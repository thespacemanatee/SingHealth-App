# REST API documentation
---

## Endpoints
- [x] [`GET /tenants/{institutionId}`](#`GET-/tenants/{institutionId}`)
- [ ] [`POST /tenants/{institutionId}`](#`POST-/tenants/{institutionId}`)
- [x] [`GET /auditFormTemplates`](#`GET-/auditFormTemplates`)
- [x] [`POST /audits`](#`POST-/audits`)
- [ ] [`GET /audits`](#`POST-/audits`)
- [x] [`POST /images`](#`POST-/images`)
- [x] [`GET /images`](#`GET-/images`)
---


## `GET /tenants/{institutionId}`
### Parameters
`institutionId`
~ Unique identifier for inst

### Sample request
```
localhost:5000/tenants/{institutionId}
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
```python
{
  "auditMetadata": {
    ...
  },
  "auditForm": {
    "fnb": {
      "hygiene": [
        ...
      ],
      "professionalism": [
        ...
      ]
    },
    "covid19": {
      "cleanliness": [
        ...
      ],
      "safety": [
        ...
      ]
    }
  } 
}
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
There are 2 ways to send in images to this endpoint:
- by json in base64 encoded format
- by Multipart/formdata


### JSON Query string parameters (for sending images in base64 str format)
`images`
~ An array of image objects each containing `fileName` & `uri`.
`fileName`
~ The name and file extension of the image. Must be globally unique.
`uri`
~ The actual image as a base64 string.


#### Dummy request
```js
{
    "images": [
        {
            "fileName": "...",
            "uri": "..."
        },
        {
            "fileName": "...",
            "uri": "..."
        }
    ]
}
```

### Multipart/formdata parameters
Category | Name
-|-
Mimetype | `image/jpg` / `image/png`
Key | `images`


!!!note
Out of base64(JSON) or formdata, **only use 1** of them per request~
!!!
### Sample response
#### Success
```js
{
  "status": 200,
  "description": "Images have successfully been uploaded"
}
```
#### Failure
```js
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
```js
{
  "fileNames": [
    "image1.png",
    "image2.png",
    "image3.png"
  ]
}
```

### Sample response
#### Success
```js
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
```js
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

##### Complete failure
```js
{
  "status": 404,
  "description": "Image3 does not exist",
  "notFound": [
    "image3 in base64",
    "image1 in base64",
    "image2 in base64"
  ]
}
```