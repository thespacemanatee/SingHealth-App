# REST API documentation
---

## Endpoints
### Authentication
- [x] [`POST /login/tenant`](#`GET-/login/tenant`)
- [x] [`POST /login/staff`](#`GET-/login/staff`)
- [x] [`POST /logout`](#`POST-/logout`)

### Tenant Management
- [x] [`POST /tenant`](#POST-/tenant`)
- [x] [`DELETE /tenant/<tenantID>`](#POST-/tenant\{tenantID}`)
- [x] [`GET /tenant/<tenantID>`](#GET-/tenant\{tenantID}`)

### Institution Management
- [x] [`GET /institutions`](#GET-/institutions`)

### Recent unrectified audits for tenant and staff
- [x] [`GET /audits/unrectified/recent/staff/<institutionID>/<int:daysBefore>`](#GET-/audits/unrectified/recent/staff/<institutionID>/<int:daysBefore>`)
- [x] [`GET /audits/unrectified/recent/tenant/<tenantID>/<int:daysBefore>`](#GET-/audits/unrectified/recent/tenant/<tenantID>/<int:daysBefore>`)

### Audit process
- [x] [`GET /tenants/{institutionId}`](#`GET-/tenants/{institutionId}`)
- [x] [`GET /auditForms/<form_type>`](#`GET-/auditForms/<form_type>`)
- [x] [`POST /audits`](#`POST-/audits`)
- [x] [`POST /images`](#`POST-/images`)

### Audit Reviewing process
- [x] [`GET /images`](#`GET-/images`)
- [x] [`GET /audits/<auditID>`](#`GET-/audits/auditID`)
- [x] [`PATCH /audits/<auditID>/tenant`](#`PATCH-/audits/auditID/tenant`)
- [x] [`PATCH /audits/<auditID>/staff`](#`PATCH-/audits/auditID/staff`)
- [x] [`GET /audits`](#`GET-/audits`)
- [x] [`GET /auditTimeframe`](#`GET-/auditTimeframe`)

### Audit Email
- [x] [`POST /email/<auditID>`](#`POST-/email/<auditID>`)

#### Others
- [ ] [`GET /audits/saved`](#`GET-/audits/saved`)

---


## `GET /tenants/{institutionId}`
### JSON body parameters
Param | Description
-|-
`institutionId` | Unique identifier for institution

<br>

### Sample request
```
localhost:5000/tenants/{institutionId}
```

### Sample success response
```
"status": 200,
"data": {
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
Attribute | Description
-|-
`tenantID` | Unique identifier for tenant
`stallName` | Name of the stall the tenant is from

<br>

## `GET /auditForms/<form_type>`
### URL Query parameters
Param | Description
-|-
`<form_type>` | Just the type. Not the ID. The endpoint will fetch the latest version of the form.<br>Examples: `fnb`, `non_fnb`, `covid19`

### Sample Request
```
localhost:5000/auditForms/fnb
```
### Sample Response
```js
"status": 200,
"data": {
    "description": "Success",
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


## `GET /audits`
### URL Query Arguments
URL Arguments | Description
-|-
`tenantID` | The unique identifier for a tenant
`daysBefore` | The number of days before which to retrieve audits from. Sending 0, which is the default input, will retrieve an infinite number of days before.

### Sample Request
```
localhost:5000/audits?tenantID=veagvtrhfvrtbhtvg&daysBefore=0
```
### Sample Response
#### Success
##### Found several matching audits
```js
"status": 200,
"data": {
    "data": [
        {
            "auditMetadata": {
                ...                
            },
            "stallName": "Mr Bean"
        },
        <AuditMetadata object w stallName/>,
        <AuditMetadata object w stallName/>
    ],
    "description": "Audits retrieved successfully"
}
```
##### Request performed, but found no matching audits
```js
"status": 200,
"data": {
    "data": [],
    "description": "No audits found"
}
```

#### Failure
##### `tenantID` not provided
```js
"status": 400,
"data": {
    "description": "No tenant ID provided"
}
```
##### `daysBefore` negative
```js
"status": 400,
"data": {
    "description": "Invalid date range provided"
}
```






## `POST /images`
---
Duplicate filenames will be rejected.
Will throw a 400 error if no images are received.

There are 2 ways to send in images to this endpoint, choose only 1 per request:
- by json in base64 encoded format
- by Multipart/formdata


### JSON body parameters (for sending images in base64 str format)
JSON param | Description
-|-
`images` | An array of image objects each containing `fileName` & `uri`.
`fileName` | The name and file extension of the image. Must be globally unique.
`uri` | The actual image as a base64 string.


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

<br>

<br>

### Sample response
#### Success
```js
"status": 200,
"data": {
  "description": "Images have successfully been uploaded"
}
```
#### Failure
```js
"status": 400,
"data": {
  "description": "Image filenames not unique"
}
```

## `GET /images`
---


### Query string args
Arg | Description
-|-
`fileName` | The name and file extension of the image. Must be globally unique.

<br>

### Sample request
```js
/images?fileName=picture.jpg
```

### Sample response
#### Success
```js
"status": 200,
"data": {
  "description": "Images have successfully been uploaded",
  "data": "image1 in base64"
}
```
#### Failure
```js
"status": 500,
"data": {
  "description": "Unexpected Error, pls try again."
}
```

```js
"status": 404,
"data": {
  "description": "Image3 does not exist"
}
```

## `POST /login/tenant`
### JSON body parameters
JSON param | Description
-|-
`user` | The user email tagged to the account
`pswd` | The password(may be hashed) security
`expoToken`| The unique identifier for the user's device based on Expo

### Sample request
```js
{
    "user": "something_else@gg.com",
    "pswd": "mujnyhbt4gyh7uj5n6yhb5t4g56yh7u6",
    "expoToken":"therhrhyrhyh5y6yh56yvt5yer"
}
```
### Sample response
#### Success
```js
"status": "200",
"data": {
    "description": "You are now logged in",
    "data": <User object/>
}
```
#### Failure
```js
"status": "400",
"data": {
    "description": "User or pswd is incorrect"
}
```


## `POST /login/staff`
Uses exactly the same request and response format as `/login/tenant`

### JSON body parameters  
JSON param | Description
-|-
`user` | The user email tagged to the account
`pswd` | The password(may be hashed) security
`expoToken`| The unique identifier for the user's device based on Expo. This is optional.

### Sample request
```js
{
    "user": "something_else@gg.com",
    "pswd": "mujnyhbt4gyh7uj5n6yhb5t4g56yh7u6",
    "expoToken":"therhrhyrhyh5y6yh56yvt5yer"
}
```
### Sample response
#### Success
```js
"status": "200",
"data": {
    "description": "You are now logged in",
    "data": <User credentials>
}
```
#### Failure
```js
"status": "400",
"data": {
    "description": "Email or pswd is incorrect"
}
```

## `POST /logout`
### JSON Query Parameters
JSON param | Description
-|-
`expoToken` | The device token that is used to send notifications to the client

### Sample request
```js
{
    "expoToken": "efvet4bgr"
}
```
### Sample response
#### Success
```js
"status": 200,
{
    "description": "You are now logged out"
}
```

## `GET /audits/<auditID>`
### URL Query Parameters
URL Param | Description
-|-
`auditID` | The unique identifier for the audit(metadata)

### Sample request
```
localhost:5000/auditForms/tegtethg4355g4gbtr
```

### Sample responses
#### Success
```js
"status": 200,
{
  "data": {
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
                  <Question Object/>,
                  <Question Object/>
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
"status": 404,
"data": {
    "description": "No matching audits found"
}
```


## `PATCH /audits/<auditID>/tenant`
### Request Arguments
URL Query Parameter | Description
-|-
`AuditID`|The unique identifier for the audit

### JSON Body parameters
JSON param | Description
-|-
`<formType>` | I.e. `fnb`, `non_fnb`, etc
`category` | The part of the form to edit
`index` | The line item to target
`rectificationImages` | [Required]: A series of images to show the staff what has been done to fix the non-compliance. Appends to the database of images and does not replace any images.
`rectificationRemarks` | [Optional] Supplement images with remarks.
`requestForExt` | [Optional] If tenant needs more time to fix non-compliance, this option raises a request to the staff for approval. Staff chooses deadline.

>### Caution
>Also, server will reject requests if it contains any PATCHes to *compliant* line items! Users are only allowed to edit non-compliant line items! Tenants will only be allowed to create these 3 fields through this endpoint: `rectificationImages`, `rectificationRemarks` & `requestForExt`. Adding any other fields will be rejected with a error code `400` and will not be processed!

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
            <Patch Object/>,
            <Patch Object/>       
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
            <Patch Object/>,
            <Patch Object/>       
    ],
    "covid19": [
        ...
    ]
    
}
```
### Sample response
#### Success
```js
"status": 200,
"data": {
    "description": "Changes sent to the database.",
    "data": [
        {
            "patch": {
                "acceptedRequest": false,
                "category": "Workplace Safety and Health",
                "deadline": "2021-03-29T11:08:15+0000",
                "index": 1,
                "rectified": false
            },
            "status": true
        },
        {
            "patch": {
                "acceptedRequest": false,
                "category": "Workplace Safety and Health",
                "deadline": "2021-03-29T11:08:15+0000",
                "index": 2,
                "rectified": false
            },
            "status": true
        },
        <PatchResult/>,
        <PatchResult/>,
        ...
    ]     
}
```
#### Failure
##### Invalid Patch Keys
When tenant tries to send anything other than the stated alllowed keys above.
```js
"status": 400,
"data": {    
    "description": "Invalid keys provided. You are trying to modify fields that are locked for modifying."    
}
```
##### Insufficient Required Keys
The following keys are required: `category` & `index`, in every Patch Object.
```js
"status": 400,
"data": {
    "description": "Unable to narrow down the line item in the audit that you want to edit."    
}
```

##### Modifying a line item marked as "Compliant"
Tenants are not allowed to modify line items that are already compliant/rectified.
```js
"status": 400,
"data": {
    "description": "You are editing a line item that was previously marked as compliant"
}
```

##### Modifying a line item marked as "Rectified"
Tenants are not allowed to modify line items that are already compliant/rectified.
```js
"status": 400,
"data": {    
    "description": "You are editing a line item that was previously marked as rectified"
}
```

##### Form type doesn't exist
When the tenant is from fnb but the request was trying to modify non_fnb
```js
"status": 400,
"data": {
    "description": "The form(fnb) you were trying to edit does not exist."
}
```

## `PATCH /audits/<auditID>/staff`
### Request Arguments
URL Request parameter | Description
-|-
`auditID`|The unique identifier for the audit

### JSON Body parameters
Check out the example below on how all these parameters are arranged in the actual request.
JSON param | Description
-|-
`<formType>` | I.e. `fnb`, `non_fnb`, etc
`category` | The part of the form to edit
`index` | The line item to target
`rectified` | [Required]: Whether the rectification has been accepted by the staff. Staff are allowed to modify this field even if `rectified = True`
`acceptedRequest` | A record of whether the request for time extension has been granted.
`deadline` | The new deadline if time extension has been granted

<br>

>### *Caution*
>Staff will only be allowed to create these 3 fields through this endpoint: `rectified`, `acceptedRequest` & `deadline`. Adding any other fields will be rejected with a error code `400` and will not be processed! 
>Also, server will reject requests if it contains any PATCHes to *compliant* line items! Users are only allowed to edit non-compliant line items!
>This PATCH request can be repeated many times. The `deadline`, `acceptedRequest` fields in the database will keep changing until `rectified` has been set to true.

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
            <Patch Object/>,
            <Patch Object/>,
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
            <Patch Object/>,
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
"status": 200,
"data": {
    "description": "Changes sent to the database"
    "data": {
        "patchResults": [
            {
                "patch": {
                    "acceptedRequest": false,
                    "category": "Workplace Safety and Health",
                    "deadline": "2021-03-29T11:08:15+0000",
                    "index": 1,
                    "rectified": false
                },
                "status": true
            },
            {
                "patch": {
                    "acceptedRequest": false,
                    "category": "Workplace Safety and Health",
                    "deadline": "2021-03-29T11:08:15+0000",
                    "index": 2,
                    "rectified": false
                },
                "status": true
            },
            <PatchResult/>,
            <PatchResult/>,
            ...
        ],
        "rectificationProgress": 0.0,
        "updatedRectProgress": true
    }
}
```
#### Failure
The failure messages are similar to those of `PATCH /audits/<auditID>/tenant`
<br>

## `POST /audits`
---
### Side effects
- Checks `savedAudits` & `savedFilledauditForms` for any data with matching IDs and deletes them.
- Checks `staff` DB under a `savedAudits` list attribute and erases any audit ID that matches those that have just been submitted.
### JSON body parameters
JSON param | Description
-|-
`auditMetadata` | JSON containing metadata about the audit
`auditForms` | JSON containing all the QnA, photos, deadlines, remarks, etc

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
"status": 200,
"data": {  
  "description": "Forms have successfully been uploaded"
}
```
#### Failure response
```js
"status": 400,
"data": {
  "description": "Duplicate image filenames found for item 3 under 'Professionalism'"
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
JSON param | Description
-|-
`auditMetadata` | JSON containing metadata about the audit
`auditForms` | JSON containing all the QnA, photos, deadlines, remarks, etc

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
"status": 200,
"data": {  
  "description": "Forms have successfully been saved",
  "data": {
      "_id": "tbry56j68%^&^&%%^YH^Y%6y5"
  }
}
```
#### Failure response
```js
"status": 502,
"data": {
    "description": "Perhaps the connection to the database is lost"
}
```
## `GET /audits/saved`
### JSON Query string parameters
JSON param | Description
-|-
`_id` | The unique identifier for the audit

### Sample request
```js
{ "_id": "vyh5h757j4^UJyh5" }
```
### Sample response
```js
"status": 200,
"data": {
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
JSON param | Description
-|-
`institutionID` | The unique identifier for the current institution. Case sensitive.<br>I.e. `CGH`, `SGH`
`daysBefore` | An integer indicating how early the audits to query from. If 0, all unrectified audits regardless of time will be returned.
### Sample request
#### With date range
```js
localhost:5000/audits/unrectified/recent/staff/grwrbgbgbewvw/4
```
#### Without date range
```js
localhost:5000/audits/unrectified/recent/staff/grwrbgbgbewvw/0
```
### Sample response
#### Success
```js
"status": 200,
"data": {    
    "description": "Forms found",
    "data": [
        {
            "auditMetadata": {
                ...                
            },
            "stallName": "Mr Bean"
        },
        <AuditMetadata object w stallName>,
        <AuditMetadata object w stallName>
    ]
}
```

#### Failure
```js
"status": 200,
"data": {
    "description": "No forms found",
    "data": []
}
```

## `GET /audits/unrectified/recent/tenant/<tenantID>/<int:daysBefore>`
### Description of use case
The tenant is interested in seeing any past audits that have not been rectified and needs to query only his own audits.
### URL parameters
URL param | Description
-|-
`tenantID` | The unique identifier for the tenant account
`daysBefore` | An integer indicating how early the audits to query from. If 0, all unrectified audits regardless of time will be returned.

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
"status": 200
"data": {
    "description": "Forms found",
    "data": [
        {
            "auditMetadata": {
                ...                
            },
            "stallName": "Mr Bean"
        },
        <Audit object w stallName/>,
        <Audit object w stallName/>
    ]
}
```

#### Failure
```js
"status": 200,
"data": {
    "description": "No forms found",
    "data": []
}
```

## `POST /tenant`
### Description of use case
The staff to add new tenant.
### Compulsory JSON Query string parameters
JSON param | Description
-|-
`name` | Tenant's full name in upper case.
`email` | The user email of a tenant.
`pswd` | The password credentials for a tenant.
`institutionID` | The institution where a tenant operates under.
`stall_name` | Name of the stall.
`company_name` | Name of the company the stall is representing.
`company_POC_name` | Name of the company POC.
`company_POC_email` | Email of the company POC.
`unit_no` | The unit number. I.e. 02-212 (without hashes).
`fnb` | Whether the stall is an F&B stall.
`staffID` | ID of staff who created this account.
`tenantDateStart` | Date when tenantship started, without including exact date. I.e. MM/YYYY
`tenantDateEnd` | The unique identifier for the tenant account. I.e. MM/YYYY

### Optional JSON Query string parameters
JSON param | Description
-|-
`blk` | blk number. I.e. 243A.
`street` | Street name.
`bldg` | Name of the building.
`zipcode` | The zipcode of the stall. I.e. 123456 (only numbers).


### Sample request
#### With only compulsory data
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
    "unit_no": "01-001",
    "fnb": true,
    "staffID": "000111",
    "stall_number": "stall 7",
  	"tenantDateStart": "03/2021",
  	"tenantDateEnd": "05/2025"
}
```
#### With complete data
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
    "blk" : "myblk",
    "street": "mystreet",
    "bldg": "bldg",
    "unit_no": "01-001",
    "zipcode": 123456,
    "fnb": true,
    "staffID": "000111",
    "stall_number": "stall 7",
  	"tenantDateStart": "03/2021",
  	"tenantDateEnd": "05/2025"
}
```
### Sample response
#### Success
```js
"status": 201,
"data": {    
    "description": "Tenant Added"
}
```

#### Partial Success
##### Missing keys, null or empty value received for compulsory data fields
```js
"status": 200,
"data": {    
    "description": "Insufficient/Error in data to add new tenant",
    "data": [
      {
      "missing_keys": ["key1", "key2", ...]
      "key_value_error": ["key3", "key4", ...]
      }
    ]
}
```

#### Failure
##### No response received
```js
"status": 404,
"data": {
    "description": "No response received"
}
```

##### Unable to upload data
```js
"status": 404,
"data": {
    "description": "Cannot upload data to server"
}
```

## `DELETE /tenant/<tenantID>`
### Description of use case
The staff to delete existing tenant.
### URL Query Parameters
URL Param | Description
-|-
`tenantID` | The unique identifier for tenant

### Sample request
```
localhost:5000/tenant/0ta2b2kjq
```

### Sample responses
#### Success
```js
"status": 200,
"data": {  
  "description": "Tenant with ID 0ta2b2kjq deleted"
}
```

#### Failure
##### TenantID not found
```js
"status": 404,
"data": {
  "description": "No matching tenant ID found"
}
```

##### Server Error
```js
"status": 404,
"data": {
  "description": "Error connecting to server"
}
```

## `POST /tenant`
### Description of use case
The staff to add new tenant.
### Compulsory JSON Query string parameters
JSON param | Description
-|-
`name` | Tenant's full name in upper case.
`email` | The user email of a tenant.
`pswd` | The password credentials for a tenant.
`institutionID` | The institution where a tenant operates under.
`stall_name` | Name of the stall.
`company_name` | Name of the company the stall is representing.
`company_POC_name` | Name of the company POC.
`company_POC_email` | Email of the company POC.
`unit_no` | The unit number. I.e. 02-212 (without hashes).
`fnb` | Whether the stall is an F&B stall.
`staffID` | ID of staff who created this account.
`tenantDateStart` | Date when tenantship started, without including exact date. I.e. MM/YYYY
`tenantDateEnd` | The unique identifier for the tenant account. I.e. MM/YYYY

### Optional JSON Query string parameters
JSON param | Description
-|-
`blk` | blk number. I.e. 243A.
`street` | Street name.
`bldg` | Name of the building.
`zipcode` | The zipcode of the stall. I.e. 123456 (only numbers).


### Sample request
#### With only compulsory data
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
    "unit_no": "01-001",
    "fnb": true,
    "staffID": "000111",
    "stall_number": "stall 7",
  	"tenantDateStart": "03/2021",
  	"tenantDateEnd": "05/2025"
}
```
#### With complete data
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
    "blk" : "myblk",
    "street": "mystreet",
    "bldg": "bldg",
    "unit_no": "01-001",
    "zipcode": 123456,
    "fnb": true,
    "staffID": "000111",
    "stall_number": "stall 7",
  	"tenantDateStart": "03/2021",
  	"tenantDateEnd": "05/2025"
}
```
### Sample response
#### Success
```js
"status": 201,
"data": {    
    "description": "Tenant Added"
}
```

#### Partial Success
##### Missing keys, null or empty value received for compulsory data fields
```js
"status": 200,
"data": {    
    "description": "Insufficient/Error in data to add new tenant",
    "data": [
      {
      "missing_keys": ["key1", "key2", ...]
      "key_value_error": ["key3", "key4", ...]
      }
    ]
}
```

#### Failure
##### No response received
```js
"status": 404,
"data": {
    "description": "No response received"
}
```

##### Unable to upload data
```js
"status": 404,
"data": {
    "description": "Cannot upload data to server"
}
```

## `POST /email/<auditID>`
### Description of use case
The staff to send audit data to his/her email.
### URL Query Parameters
URL Param | Description
-|-
`auditID` | The unique identifier for audit

### Sample request
```
localhost:5000/email/0ta2b2kjq
```

### Sample responses
#### Success
```js
"status": 200,
"data": {
    "description": "Audit email sent"
}
```

#### Failure
##### Missing or Error in server when retrieving content
###### "Missing": field is not found in database
###### "Error": error in connection to database when collecting field 
###### field type: "audit", "staff", "tenant", "institution"
```js
"status": 404,
"data":{
    "description": "Missing/Error in information"
    "data" : {
        "error" : ["field1", "field2", ...],
        "missing" :  ["field3", "field4", ...]
    }
}
```

##### Email Sending Error
```js
"status": 404,
"data": {
    "description": "Error in sending email"
}
```

## `GET /institutions`
### Sample request
```
localhost:5000/institutions
```

### Sample responses
#### Success
```js
"status": 200,
"data": {
    "description": "Success",
    "data": [
        {"institutionID": "CGH",
        "institutionName": "Changi General Hospital"}, 
        {"institutionID": "SKH",
        "institutionName": "Sengkang General Hospital"},
        ...
    ]
}
```

### Response definitions
Attribute | Description
-|-
`institutionID` | Unique identifier for institutions
`institutionName` | Name of the institutions


#### Failures
##### No institution found
```js
"status": 404,
"data": {
    "description": "No institution found"
}
```

##### Server Connection Error
```js
"status": 404,
"data": {
    "description": "Error in connection"
}
```

## `GET /auditTimeframe`
### Description of use case
The staff to get all audit data within a timeframe.

### Compulsory JSON Query string parameters
JSON param | Description
-|-
`fromDate` | DateTime object with the start date of audit data to extract
`toDate` | DateTime object with the end date of audit data to extract


### Sample request
```js
{
    "fromDate": datetime.datetime(2021, 4, 1, 0, 0, 0, 0) ,
    "toDate": datetime.datetime(2021, 4, 6, 23, 59, 59, 999999) 
}
```

### Sample responses
#### Success
```js
"status": 200,
"data": {
    "description": "Success",
    "data": [
        {"date": datetime.datetime(2021, 4, 1, 0, 0, 0, 0), "avg_score" : 0.032},  {"date": datetime.datetime(2021, 4, 2, 0, 0, 0, 0), "avgScore" : 0.932}, 
        {...}
        ...
    ]
}
```

### Response definitions
Attribute | Description
-|-
`date` | DateTime object of the audit data
`avgScore` | Average score of all audit perform on this date, rounded in 3dp

#### Partial Failures
##### Missing or empty input JSON
```js
"status": 404,
"data": {
    "description": "No audit data found within the timeframe",
    "data": {
        "missing_keys":[field1, ...]
        "key_value_error": [field2, ...]
    }
}
```

#### Failures
##### No audit data found
```js
"status": 404,
"data": {
    "description": "No audit data found within the timeframe"
}
```

##### Server Connection Error
```js
"status": 404,
"data": {
    "description": "Error in connection"
}
```

