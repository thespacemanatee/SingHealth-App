# REST API documentation
---

## Endpoints
- [x] [`GET /tenants/{institutionId}`](#`GET-/tenants/{institutionId}`)
- [x] [`GET /auditForms/<form_type>`](#`GET-/auditForms/<form_type>`)
- [x] [`POST /audits`](#`POST-/audits`)
- [x] [`POST /images`](#`POST-/images`)
- [x] [`GET /images`](#`GET-/images`)
- [x] [`GET /login/tenant`](#`GET-/login/tenant`)
- [x] [`GET /login/staff`](#`GET-/login/staff`)
- [ ] [`GET /audits/saved`](#`GET-/audits/saved`)
- [ ] [`GET /audits/recent/staff`](#GET-/audits/recent/staff`)
- [ ] [`GET /audits/recent/staff`](#GET-/audits/recent/tenant`)
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

## `GET /auditForms/<form_type>`
### Query parameters
`<form_type>`
~ Just the type. Not the ID. The endpoint will fetch the latest version of the form.
~ Examples: `fnb`, `non_fnb`, `covid19`
### Sample Request
```
localhost:5000/auditForms/fnb
```
### Sample Response
```js
{
  "description": "Success",
  "status": 200,
  "data": {
    "_id": "fnb2021",
    "type": "fnb",
    "questions": {
      "category1": [
        {
          "question": "...",
          "answer": false
        },
        {
          "question": "...",
          "answer": false
        }
      ],
      "category2": [
        {
          "question": "...",
          "answer": false
        },
        {
          "question": "...",
          "answer": false
        }
      ]
    }
  }
}
```


<br>

## `POST /audits`
---
### Side effects
- Checks `savedAudits` & `savedFilledauditForms` for any data with matching IDs and deletes them.
- Checks `staff` DB under a `savedAudits` list attribute and erases any audit ID that matches those that have just been submitted.
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

## `GET /login/tenant`
### JSON Query string parameters
`user`
~ The user email tagged to the account
`pswd`
~ The password(may be hashed) security

### Sample request
```js
{
    "user": "something_else@gg.com",
    "pswd": "mujnyhbt4gyh7uj5n6yhb5t4g56yh7u6"
}
```
### Sample response
#### Success
```js
{
    "status": "200",
    "description": "You are now logged in"
}
```
#### Failure
```js
{
    "status": "400",
    "description": "User or pswd is incorrect"
}
```

## `GET /login/staff`
!!!note
Uses exactly the same request and response format as `/login/tenant`
!!!

`user`
~ The user email tagged to the account
`pswd`
~ The password(may be hashed) security

### Sample request
```js
{
    "user": "something_else@gg.com",
    "pswd": "mujnyhbt4gyh7uj5n6yhb5t4g56yh7u6"
}
```
### Sample response
#### Success
```js
{
    "status": "200",
    "description": "You are now logged in"
}
```
#### Failure
```js
{
    "status": "400",
    "description": "User or pswd is incorrect"
}
```

## `POST /audits/saved`
### Description of use case
When staff leave the app halfway through an audit, usually to go back to the office to sort out the photos and remarks, the audit will be sent to the database for archival just in case the data is lost on the staff's phone.
The data is stored in a separate collection called `savedAudits` & `savedfilledAuditForms` and **must be deleted manually.**
Similar query format to `POST /audits` but data is not checked for validity.
Questions will not be removed from each audit line item.
The audit ID will also be saved in the Staff profile in the DB.

### JSON Query string parameters
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
```js
{
  "status": 200,
  "description": "Forms have successfully been saved",
  "data": {
      "_id": "tbry56j68%^&^&%%^YH^Y%6y5"
  }
}
```
#### Failure response
```js
{
  "status": 502,
  "description": "Perhaps the connection to the database is lost"
}
```
## `GET /audits/saved`
### JSON Query string parameters
`_id`
~ The unique identifier for the audit

### Sample request
```js
{ "_id": "vyh5h757j4^UJyh5" }
```
### Sample response
```js
{
  "status": 200,
  "description": "Forms have successfully been retrieved",
  "data": {
      "auditMetadata": {
          ...
      },
      "auditForm": {
          "fnb": {
              "hygiene": [
                  {
                    "question":"Are you okay?",
                    "answer": true
                  },
                  { ... },
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
}
```
#### Success
#### Failure

## `GET /audits/unrectified/recent/staff`
### Description of use case
The staff app has a dashboard which displays recent audits that have not been fully rectified. The staff needs to see audits from all the tenants under his/her charge.
### JSON Query string parameters
`institutionID`
~ the unique identifier for the current institution. Case sensitive 
~ I.e. `CGH`, `SGH`
`daysBefore`
~ An integer indicating how early the audits to query from.
~ If `null`, all unrectified audits regardless of time will be returned.
### Sample request
#### With date range
```js
{
    "institutionID": "CGH",
    "daysBefore": 3
}
```
#### Without date range
```js
{
    "institutionID": "CGH"
}
```
### Sample response
#### Success
```js
{
    "status": 200,
    "description": "Forms found",
    "data": [
        <Audit object>,
        <Audit object>
    ]
}
```

#### Failure
```js
{
    "status": 404,
    "description": "No matching Forms",
    "data": []
}
```

## `GET /audits/unrectified/recent/tenant`
### Description of use case
The tenant is interested in seeing any past audits that have not been rectified and needs to query only his own audits.
### JSON Query string parameters
`tenantID`
~ The unique identifier for the tenant account
`daysBefore`
~ An integer indicating how early the audits to query from.
~ If `null`, all unrectified audits regardless of time will be returned.
### Sample request
#### With date range
```js
{
    "tenantID": "CGH",
    "daysBefore": 3
}
```
#### Without date range
```js
{
    "tenantID": "CGH"
}
```
### Sample response
#### Success
```js
{
    "status": 200,
    "description": "Forms found",
    "data": [
        <Audit object>,
        <Audit object>
    ]
}
```

#### Failure
```js
{
    "status": 404,
    "description": "No matching Forms",
    "data": []
}
```