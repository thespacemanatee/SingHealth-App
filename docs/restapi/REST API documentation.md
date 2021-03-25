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
- [ ] [`GET /audits/<auditID>`](#`GET-/audits/auditID`)
- [ ] [`PATCH /audits/<auditID>/tenant`](#`PATCH-/audits/auditID/tenant`)
- [ ] [`PATCH /audits/<auditID>/staff`](#`PATCH-/audits/auditID/staff`)
- [ ] [`GET /audits/saved`](#`GET-/audits/saved`)
- [x] [`GET /audits/unrectified/recent/staff/<institutionID>/<int:daysBefore>`](#GET-/audits/unrectified/recent/staff/<institutionID>/<int:daysBefore>`)
- [x] [`GET /audits/unrectified/recent/tenant/<tenantID>/<int:daysBefore>`](#GET-/audits/unrectified/recent/tenant/<tenantID>/<int:daysBefore>`)
- [ ] [`GET /tenant/delete/{tenantID}`](#GET-/tenant/delete/{tenantID}`)
- [ ] [`POST /tenant/add`](#POST-/tenant/add`)
---


## `GET /tenants/{institutionId}`
### JSON body parameters
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
### URL Query parameters
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

## `POST /images`
---
There are 2 ways to send in images to this endpoint:
- by json in base64 encoded format
- by Multipart/formdata


### JSON body parameters (for sending images in base64 str format)
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
### JSON body parameters
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

## `POST /login/tenant`
### JSON body parameters
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
    "description": "You are now logged in",
    "data": <User credentials>
}
```
#### Failure
```js
{
    "status": "400",
    "description": "User or pswd is incorrect"
}
```


## `POST /login/staff`
!!!note
Uses exactly the same request and response format as `/login/tenant`
!!!
### JSON body parameters
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
    "description": "You are now logged in",
    "data": <User credentials>
}
```
#### Failure
```js
{
    "status": "400",
    "description": "User or pswd is incorrect"
}
```

## `GET /audits/<auditID>`
### URL Query Parameters
`auditID`
~ The unique identifier for the audit(metadata)

### Sample request
```
localhost:5000/auditForms/tegtethg4355g4gbtr
```

### Sample responses
#### Success
```js
{
  "status": 200,
  "data":{
      "auditMetadata": {
        ...
      },
      "auditForm": {
          "fnb": {
              "hygiene": [
                  {
                      "question": "How are you?",
                      "answer": true
                  },
                  <Question Object>,
                  <Question Object>
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

#### Failure
```js
{
  "status": 404,
  "description": "No matching audits found"
}
```


## `PATCH /audits/<auditID>/tenant`
### JSON Body parameters
`<formType>`
~ I.e. `fnb`, `non_fnb`, etc
`category`
~ The part of the form to edit
`index`
~ The line item to target
`rectificationImages`
~ [Required]: A series of images to show the staff what has been done to fix the non-compliance. Appends to the database of images and does not replace any images.
`rectificationRemarks`
~ [Optional] Supplement images with remarks.
`requestForExt`
~ [Optional] If tenant needs more time to fix non-compliance, this option raises a request to the staff for approval. Staff chooses deadline.

!!!caution
Also, server will reject requests if it contains any PATCHes to *compliant* line items! Users are only allowed to edit non-compliant line items!

Tenants will only be allowed to create these 3 fields through this endpoint: `rectificationImages`, `rectificationRemarks` & `requestForExt`. Adding any other fields will be rejected with a error code `400` and will not be processed!
!!!

#### Example
```js
{
    <formType>: [
            {
                "category": "Category Name",
                "index": 0,
                "rectificationImages": ["filename1", "filename2"],
                "rectificationRemarks": "Remarks",
                "requestForExt": bool
            },
            <Patch Object>,
            <Patch Object>       
    ],
    <formType>: [
        ...
    ]
    
}
```

### Sample request
```js
{
    "fnb": [
            {
                "category": "Professionalism",
                "index": 0,
                "rectificationImages": ["img007", "img008"],
                "rectificationRemarks": "hello, this is me",
                "requestForExt": True
            },
            <Patch Object>,
            <Patch Object>       
    ],
    "covid19": [
        ...
    ]
    
}
```
### Sample response
#### Success
```js
{
    "status": 200,
    "description": "All patches saved and added to database"
}
```
#### Failure
```js
{
    "status": 400,
    "description": "Wrong form name: fmb"    
}
```

## `PATCH /audits/<auditID>/staff`
### JSON Body parameters
Check out the example below on how all these parameters are arranged in the actual request.

`<formType>`
~ I.e. `fnb`, `non_fnb`, etc
`category`
~ The part of the form to edit
`index`
~ The line item to target
`rectified`
~ [Required]: Whether the rectification has been accepted by the staff.
`acceptedRequest`
~ A record of whether the request for time extension has been granted.
`deadline`
~ The new deadline if time extension has been granted

!!!caution
Staff will only be allowed to create these 3 fields through this endpoint: `rectified`, `acceptedRequest` & `deadline`. Adding any other fields will be rejected with a error code `400` and will not be processed!

Also, server will reject requests if it contains any PATCHes to *compliant* line items! Users are only allowed to edit non-compliant line items!
!!!
!!!note
This PATCH request can be repeated many times. The `deadline`, `acceptedRequest` fields in the database will keep changing until `rectified` has been set to true
!!!

#### Example
```js
{
    <formType>: [
            {
                "category": "Category Name",
                "index": 0,
                "deadline": (Str Date in ISO),
                "rectified": bool,
                "acceptedRequest": bool
            },
            <Patch Object>,
            <Patch Object>,
            ...
    ],
    <formType>: [
        ...
    ]
    
}
```

### Sample request
```js
{
    "fnb": [
            {
                "category": "Professionalism",
                "index": 20,
                "deadline": null,
                "rectified": true,
                "acceptedRequest": null
            },
            {
                "category": "Professionalism",
                "index": 21,
                "deadline": "2021-03-25T01:38:34+0000",
                "rectified": false,
                "acceptedRequest": true
            },
            <Patch Object>,
            ...
    ],
    "covid19": [
        ...
    ]
    
}
```
### Sample response
#### Success
```js
{
    "status": 200,
    "description": "All patches saved and added to database"
}
```
#### Failure
```js
{
    "status": 400,
    "description": "Wrong form name: fmb"    
}

{
    "status": 400,
    "description": "Line item already compliant and is not open for editing"    
}
```

## `POST /audits`
---
### Side effects
- Checks `savedAudits` & `savedFilledauditForms` for any data with matching IDs and deletes them.
- Checks `staff` DB under a `savedAudits` list attribute and erases any audit ID that matches those that have just been submitted.
### JSON body parameters
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
  "auditForms": {
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
  "description": "Forms have successfully been uploaded"
}
```
#### Failure response
```js
{
  "status": 400,
  "description": "Duplicate image filenames found",
  "category": "Professionalism",
  "index": 0
}
```

<br>
<br>



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

## `GET /audits/unrectified/recent/staff/<institutionID>/<int:daysBefore>`
### Description of use case
The staff app has a dashboard which displays recent audits that have not been fully rectified. The staff needs to see audits from all the tenants under his/her charge.
### JSON parameters
`institutionID`
~ the unique identifier for the current institution. Case sensitive 
~ I.e. `CGH`, `SGH`
`daysBefore`
~ An integer indicating how early the audits to query from.
~ If 0, all unrectified audits regardless of time will be returned.
### Sample request
#### With date range
```js
localhost:5000/audits/unrectified/recent/staff/grwrbgbgbewvw/4
```
#### Without date range
```js
localhost:5000/audits/unrectified/recent/staff/grwrbgbgbewvw/4
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

## `GET /audits/unrectified/recent/tenant/<tenantID>/<int:daysBefore>`
### Description of use case
The tenant is interested in seeing any past audits that have not been rectified and needs to query only his own audits.
### URL parameters
`tenantID`
~ The unique identifier for the tenant account
`daysBefore`
~ An integer indicating how early the audits to query from.
~ If 0, all unrectified audits regardless of time will be returned.
### Sample request
#### With date range
```js
localhost:5000/audits/unrectified/recent/tenant/grwrbgbgbewvw/4
```
#### Without date range
```js
localhost:5000/audits/unrectified/recent/tenant/grwrbgbgbewvw/0
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

## `GET /tenant/delete/<tenantID>`
### Description of use case
To delete existing tenant
### URL parameters
`tenantID`
~ The unique identifier for the tenant account
### Sample request
```
localhost:5000/tenant/delete/<tenantID>
```
### Sample response
#### Success [tenantID found]
```js
{
    "status": 200,
    "description": "success",
    "data" : []
}
```

#### Partial Failure [tenantID not found]
```js
{
    "status": 200,
    "description": "no matching data",
    "data" : []
}
```

#### Failure
```js
{
    "status": 404,
    "description": "Tenant cannot be deleted",
    "data": []
}
```
## `POST /tenant/add`
### JSON body parameters
`name`
~ The name of the tenant
`email`
~ The email of the tenant
`pswd`
~ The password
`institutionID`
~ The institution ID of the tenant
`stall_name`
~ The stall name of the tenant
`company_name`
~ The company name of the tenant
`company_POC_name`
~ The name of the company POC for the tenant
`company_POC_email`
~ The email of the company POC for the tenant
`unit_no`
~ The unit number of the tenant
`fnb`
~ If the stall is fnb 
`staffID`
~ The staff ID of the staff who made the add request
`date`
~ The date of the add request

#### Optional
`{group}`
~ The group that the stall belongs to
`{stall number}`
~ The stall number

### Sample request
```js
{
    "name": "myname",
    "email": "myemail.gg.com",
    "pswd": "mypassword",
    "institutionID": "myinstitution",
    "stall_name": "mystall",
    "company_name": "mycompany",
    "company_POC_name": "my_poc_name",
    "company_POC_email": "my_poc_email",
    "unit_no": "myunit",
    "fnb": true,
    "staffID": "000111",
    "date": "dd/mm/yyyy",
    "group": "koufu",
    "stall_number": "stall 7"
}
```
### Sample response
#### Success
```js
{
    "status": "200",
    "description": "New tenant added"
}
```

#### Partial Failure
##### Empty response received
```js
{
    "status": "200",
    "description": "No data received"
}
```

##### Partial data posted
```js
{
    "status": "200",
    "description": "Insufficient data to add new tenants"
}
```

##### Error in data
```js
{
    "status": "200",
    "description": "Error in data"
}
```

#### Failure
##### Error in accessing database
```js
{
    "status": "404",
    "description": "Cannot upload data to server"
}
```

##### No response is posted
```js
{
    "status": "404",
    "description": "No response received"
}
```
