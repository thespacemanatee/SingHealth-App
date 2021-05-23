# REST API documentation

---

## Endpoints

### Authentication

- [x] [`POST /login/tenant`](#`GET-/login/tenant`)
- [x] [`POST /login/staff`](#`GET-/login/staff`)
- [x] [`POST /logout`](#`POST-/logout`)

### Tenant Management

- [x] [`POST /tenant`](#POST-/tenant`)
- [x] [`DELETE /tenant/<tenantID>`](#DELETE-/tenant{tenantID}`)
- [x] [`GET /tenant/<tenantID>`](#GET-/tenant/{tenantID}`)

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
- [ ] [`GET /images/upload_url`](#`GET-/images/upload_url`)
- [x] [`GET /audits/<auditID>`](#`GET-/audits/auditID`)
- [x] [`PATCH /audits/<auditID>/tenant`](#`PATCH-/audits/auditID/tenant`)
- [x] [`PATCH /audits/<auditID>/staff`](#`PATCH-/audits/auditID/staff`)
- [x] [`GET /audits`](#`GET-/audits`)
- [x] [`GET /auditTimeframe/<fromDate><toDate><dataType><dataID>`](#`GET-/auditTimeframe/<fromDate>&<toDate><dataType><dataID>`)
- [x] [`GET /notifications`](#`GET-/notifications`)
- [ ] [`PATCH /notifications`](#`PATCH-/notifications`)

### Audit Email

- [x] [`POST /email/word/<auditID>`](#`POST-/email/word/<auditID>`)

#### Others

- [ ] [`GET /audits/saved`](#`GET-/audits/saved`)

---

## `GET /tenants/{institutionId}`

### JSON body parameters

| Param           | Description                       |
| --------------- | --------------------------------- |
| `institutionId` | Unique identifier for institution |

<br>

### Sample request

```
http://127.0.0.1:5000/tenants?institutionID=SKH
```

### Sample responses

#### Success

```
"status": 200,
"data": {
    "description": "success",
    "data": [{
        "fnb": false,
        "stallName": "Continental Electronics",
        "tenantID": "6065de0ec8b7adbe23debd90"
    }, {
        "fnb": true,
        "stallName": "BAN MAIN FISH SOUP",
        "tenantID": "6065de9ac8b7adbe23debd91"
    }]
}
```

#### Partial Failure

##### Missing Information

```
"status": 200,
"data": {
    "description": "Missing institutionID"}
}
```

##### No tenant found

```
"status": 200,
"data": {
    "description": "No tenant with the institution ID found"}
}
```

#### Failure

#####

```
"status": 404,
"data": {
    "description": "Internal Error",
}
```

### Response definitions

| Attribute   | Description                          |
| ----------- | ------------------------------------ |
| `tenantID`  | Unique identifier for tenant         |
| `stallName` | Name of the stall the tenant is from |
| `fnb`       | If the stall is an F&B outlet        |

<br>

## `GET /auditForms/<form_type>`

### URL Query parameters

| Param         | Description                                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `<form_type>` | Just the type. Not the ID. The endpoint will fetch the latest version of the form.<br>Examples: `fnb`, `non_fnb`, `covid19` |

### Sample Request

```
http://127.0.0.1:5000/auditForms?formType=covid19
```

### Sample Response

#### Success

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

#### Partial Failure

##### Missing Information

```
"status": 200,
"data": {
    "description": "Missing form type"}
}
```

##### No tenant found

```
"status": 200,
"data": {
    "description": "No matching form"}
}
```

#### Failure

#####

```
"status": 404,
"data": {
    "description": "Internal Error",
}
```

## `GET /audits`

### URL Query Arguments

| URL Arguments | Description                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tenantID`    | The unique identifier for a tenant                                                                                                               |
| `daysBefore`  | The number of days before which to retrieve audits from. Sending 0, which is the default input, will retrieve an infinite number of days before. |

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

## `GET /images/upload-url`
---
Gets a Amazom S3 presigned url for client to upload a single file.
### Sample request

```
/images/upload-url
```
### Sample response

#### Success

```js
"status": 200,
"data": {
  "description": "Presigned upload URL successfully generated",
  "data": {
    "url": "https://singhealth.s3.amazonaws.com/",
    "fields": {
        "key": "exampleFileName.jpg",
        "AWSAccessKeyId": "AKIAIIFTHJDDKRYMAFZQ",
        "policy": "eyJleHBpcmF0aW9uIjogIjIwMjEtMDUtMjFUMTU6MjU6MTFaIiwgImNvbmRpdGlvbnMiOiBbeyJidWNrZXQiOiAic2luZ2hlYWx0aCJ9LCB7ImtleSI6ICJleGFtcGxlRmlsZU5hbWUuanBnIn1dfQ==",
        "signature": "svfcIx9vkN3GkIgpT78Qij84d5o="
        }
    }
}
```

## `GET /images/download-url`
### Request Args
Arg | Description
-|-
fileName | Name of file. Includes the extension.
### Sample request
```
/images/download-url?fileName=e4566tgy56h4tg3rfyhrf3gttrr.jpg
```
### Sample response


#### Success
```js
"status": 200,
"data": {
  "description": "Presigned download URL successfully generated",
  "data": "https://singhealth.s3.amazonaws.com/60633999bf3a4370134c31041341667097886.jpg?AWSAccessKeyId=AKIAIIFTHJDDKRYMAFZQ&Signature=fw7FjR9hgpumd4FZrbny%2FRRk9h4%3D&Expires=1621674652"
    }
}
```

#### Failure
##### No such image
```js
"status": 404,
"data": {
  "description": "The specified object does not exist",
  "data": null
    }
}
```
##### No file name provided
```js
"status": 400,
"data": {
  "description": "Pls provide a file name",
  "data": null
    }
}
```

## `GET /images`

---
Gets a Amazom S3 presigned url for client to download a single file.

### Query string args

| Arg        | Description                                                        |
| ---------- | ------------------------------------------------------------------ 
| `fileName` | The name and file extension of the image. Must be globally unique. |

### Sample request

```
/images?fileName=picture.jpg
```

### Sample response

#### Success

```js
"status": 200,
"data": {
  "description": "Presigned upload URL successfully generated",
  "data": "https://singhealth.s3.amazonaws.com/picture.jpg"
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

| JSON param  | Description                                               |
| ----------- | --------------------------------------------------------- |
| `user`      | The user email tagged to the account                      |
| `pswd`      | The password(may be hashed) security                      |
| `expoToken` | The unique identifier for the user's device based on Expo |

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

| JSON param  | Description                                                                  |
| ----------- | ---------------------------------------------------------------------------- |
| `user`      | The user email tagged to the account                                         |
| `pswd`      | The password(may be hashed) security                                         |
| `expoToken` | The unique identifier for the user's device based on Expo. This is optional. |

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

| JSON param  | Description                                                       |
| ----------- | ----------------------------------------------------------------- |
| `expoToken` | The device token that is used to send notifications to the client |

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

| URL Param | Description                                   |
| --------- | --------------------------------------------- |
| `auditID` | The unique identifier for the audit(metadata) |

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

| URL Query Parameter | Description                         |
| ------------------- | ----------------------------------- |
| `AuditID`           | The unique identifier for the audit |

### JSON Body parameters

| JSON param             | Description                                                                                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<formType>`           | I.e. `fnb`, `non_fnb`, etc                                                                                                                                        |
| `category`             | The part of the form to edit                                                                                                                                      |
| `index`                | The line item to target                                                                                                                                           |
| `rectificationImages`  | [Required]: A series of images to show the staff what has been done to fix the non-compliance. Appends to the database of images and does not replace any images. |
| `rectificationRemarks` | [Optional] Supplement images with remarks.                                                                                                                        |
| `requestForExt`        | [Optional] If tenant needs more time to fix non-compliance, this option raises a request to the staff for approval. Staff chooses deadline.                       |

> ### Caution
>
> Also, server will reject requests if it contains any PATCHes to _compliant_ line items! Users are only allowed to edit non-compliant line items! Tenants will only be allowed to create these 3 fields through this endpoint: `rectificationImages`, `rectificationRemarks` & `requestForExt`. Adding any other fields will be rejected with a error code `400` and will not be processed!

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

| URL Request parameter | Description                         |
| --------------------- | ----------------------------------- |
| `auditID`             | The unique identifier for the audit |

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

> ### _Caution_
>
> Staff will only be allowed to create these 3 fields through this endpoint: `rectified`, `acceptedRequest` & `deadline`. Adding any other fields will be rejected with a error code `400` and will not be processed!
> Also, server will reject requests if it contains any PATCHes to _compliant_ line items! Users are only allowed to edit non-compliant line items!
> This PATCH request can be repeated many times. The `deadline`, `acceptedRequest` fields in the database will keep changing until `rectified` has been set to true.

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

| JSON param      | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| `auditMetadata` | JSON containing metadata about the audit                     |
| `auditForms`    | JSON containing all the QnA, photos, deadlines, remarks, etc |

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

| JSON param      | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| `auditMetadata` | JSON containing metadata about the audit                     |
| `auditForms`    | JSON containing all the QnA, photos, deadlines, remarks, etc |

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

| JSON param | Description                         |
| ---------- | ----------------------------------- |
| `_id`      | The unique identifier for the audit |

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

| JSON param      | Description                                                                                                                 |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `institutionID` | The unique identifier for the current institution. Case sensitive.<br>I.e. `CGH`, `SGH`                                     |
| `daysBefore`    | An integer indicating how early the audits to query from. If 0, all unrectified audits regardless of time will be returned. |

### Sample request

#### With date range

```js
localhost: 5000 / audits / unrectified / recent / staff / grwrbgbgbewvw / 4;
```

#### Without date range

```js
localhost: 5000 / audits / unrectified / recent / staff / grwrbgbgbewvw / 0;
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

| URL param    | Description                                                                                                                 |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `tenantID`   | The unique identifier for the tenant account                                                                                |
| `daysBefore` | An integer indicating how early the audits to query from. If 0, all unrectified audits regardless of time will be returned. |

### Sample request

#### With date range

```js
localhost: 5000 / audits / unrectified / recent / tenant / grwrbgbgbewvw / 4;
```

#### Without date range

```js
localhost: 5000 / audits / unrectified / recent / tenant / grwrbgbgbewvw / 0;
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

| JSON param      | Description                                              |
| --------------- | -------------------------------------------------------- |
| `name`          | Tenant's full name in upper case.                        |
| `stallName`     | Name of the stall.                                       |
| `email`         | The user email of a tenant. Unique email for each tenant |
| `pswd`          | The password credentials for a tenant.                   |
| `fnb`           | Whether the stall is an F&B stall.                       |
| `institutionID` | The institution where a tenant operates under.           |
| `staffID`       | ID of staff who created this account.                    |

### Optional JSON Query string parameters

| JSON param        | Description                                |
| ----------------- | ------------------------------------------ |
| `tenantDateStart` | Time when tenant starts, in MM/YYYY format |
| `tenantDateEnd`   | Time when tenant ends, in MM/YYYY format   |

### Sample request

#### With only compulsory data

```js
{
    "name": "myname",
    "stallName": "mystall",
    "email": "myemail.gg.com",
    "pswd": "mypassword",
    "institutionID": "myinstitution",
    "fnb": true,
    "staffID": "000111"
}
```

#### With all compulsory data

```js
{
    "name": "myname",
    "stallName": "mystall",
    "email": "myemail.gg.com",
    "pswd": "mypassword",
    "institutionID": "myinstitution",
    "fnb": true,
    "staffID": "000111",
    "tenantDateStart": "01/2021",
    "tenantDateEnd": "12/2025"
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

##### Duplicate email found

```js
"status": 200,
"data": {
    "description": "Duplicate email found"
}
```

##### Missing keys, null or empty value received for compulsory data fields and duplicate email found

```js
"status": 200,
"data": {
    "description": "Duplicate email and insufficient/error in data to add new tenant",
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

| URL Param  | Description                      |
| ---------- | -------------------------------- |
| `tenantID` | The unique identifier for tenant |

### Sample request

```
http://127.0.0.1:5000/tenant?tenantID=6074222a576f86e1952e8be1
```

### Sample responses

#### Success

```js
"status": 200,
"data": {
  "description": "Tenant with ID 6074222a576f86e1952e8be1 deleted"
}
```

#### Partial Failure

##### Missing TenantID

```js
"status": 200,
"data": {
  "description": "Missing tenantID"
}
```

##### TenantID not found

```js
"status": 200,
"data": {
  "description": "No matching tenant ID found"
}
```

#### Failure

##### Server Error

```js
"status": 404,
"data": {
  "description": "Error connecting to server"
}
```

##### Error in deleting data

```js
"status": 404,
"data": {
  "description": "Error deleting the tenant"
}
```

## `GET /tenant/<tenantID>`

### URL Query Parameters

| URL Param  | Description                      |
| ---------- | -------------------------------- |
| `tenantID` | The unique identifier for tenant |

### Sample request

```
http://127.0.0.1:5000/tenant?tenantID=6074222a576f86e1952e8be1
```

### Sample responses

#### Success

```js
"status": 200,
"data": {
  "description": "Success",
  "data": {
        "_id": "6074222a576f86e1952e8be1",
        "createdBy": "000111",
        "dateCreated": "2021-04-12T18:34:18.955069",
        "email": "myemail.gg.com",
        "expoToken": [],
        "fnb": true,
        "institutionID": "myinstitution",
        "name": "myname",
        "pswd": "mypassword",
        "stallName": "mystall",
        "tenantDateEnd": "12/2025",
        "tenantDateStart": "01/2021"
    }
}
```

#### Partial Failure

##### Missing TenantID

```js
"status": 200,
"data": {
  "description": "Missing tenantID"
}
```

##### TenantID not found

```js
"status": 200,
"data": {
  "description": "No matching tenant ID found"
}
```

#### Failure

##### Server Error

```js
"status": 404,
"data": {
  "description": "Error connecting to server"
}
```

## `POST /email/word/<auditID>`

### Description of use case

The staff to send audit data to his/her email.

### URL Query Parameters

| URL Param | Description                     |
| --------- | ------------------------------- |
| `auditID` | The unique identifier for audit |

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

| Attribute         | Description                        |
| ----------------- | ---------------------------------- |
| `institutionID`   | Unique identifier for institutions |
| `institutionName` | Name of the institutions           |

#### Failures

##### No institution found

```js
"status": 200,
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

## `GET /auditTimeframe/<fromDate><toDate><dataType><dataID>`

### Description of use case

The staff to get all audit data within a timeframe.

### Compulsory JSON Query string parameters

| JSON param | Description                                                                    |
| ---------- | ------------------------------------------------------------------------------ |
| `fromDate` | DateTime string in milli format with the start date of audit data to extract   |
| `toDate`   | DateTime string in milli format with the end date of audit data to extract     |
| `dataType` | Type of graph to extract, 'institution', 'tenant' or None                      |
| `dataID`   | Unique identifier for the tenant or institution, None value if dataType = None |

### Sample request

```js
127.0.0.1:5000/auditTimeframe?fromDate=1510096007965&toDate=1618163047328&dataType=institution&dataID=SKH
```

### Sample responses

#### Success

```js
"status": 200,
"data": {
    "description": "Success",
    "data": [{
        "avgScore": 0.9,
        "date": "2021-04-04T00:00:00"
        }, {
        "avgScore": 0.994,
        "date": "2021-04-05T00:00:00"
        }, {
        "avgScore": 0.994,
        "date": "2021-04-06T00:00:00"
        }, {
        "avgScore": 0.983,
        "date": "2021-04-07T00:00:00"
        }]
}
```

### Response definitions

| Attribute  | Description                                                     |
| ---------- | --------------------------------------------------------------- |
| `date`     | DateTime is iso format of the audit data                        |
| `avgScore` | Average score of all audit perform on this date, rounded in 3dp |

#### Partial Failures

##### Wrong date format

```js
"status": 400,
"data": {
    "description": "Wrong date format"
}
```

##### Wrong data format

```js
"status": 400,
"data": {
    "description": "Insufficient data or wrong data format"
}
```

#### Failures

##### No audit data found

```js
"status": 200,
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

## `GET /notifications`

### Query string args

| Arg      | Description                       |
| -------- | --------------------------------- |
| `userID` | The unique identifier for a user. |

<br>

### Sample Request

```
localhost:5000/notifications?userID=veagvtrhfvrtbhtvg
```

### Sample Response

#### Success

##### Found a several notifications

```js
"status": 200,
"data": {
    "data": [
        {
            "auditID": "veagvtrhfvrtbhtvg",
            "stallName": "Mr Bean",
            "type": "patch",
            "message": {
                "index": "1",
                "checklistType": "non-fnb",
                "section": "Housekeeping and General Cleanliness",
                "rectified": boolean
             }
        },
        <Notification />,
        <Notification />
    ],
    "description": "Notifications retrieved successfully"
}
```

##### Rectification message object

```js
{
    "auditID": "veagvtrhfvrtbhtvg",
    "stallName": "Mr Bean",
    "type": "patch",
    "message": {
        "index": "1",
        "checklistType": "non-fnb",
        "section": "Housekeeping and General Cleanliness",
        }
},
```

##### New audit message object

```js
{
    "auditID": "veagvtrhfvrtbhtvg",
    "stallName": "Mr Bean",
    "type": "post",
    "message": `New audit on ${dateTime} ready for viewing. `
},
```

##### Request performed, but found no matching notifications

```js
"status": 200,
"data": {
    "data": [],
    "description": "No notifications found"
}
```

#### Failure

##### `userID` not provided

```js
"status": 400,
"data": {
    "description": "No userID provided"
}
```

## PATCH /notifications

### Query string args

| Arg       | Description                       |
| --------- | --------------------------------- |
| `notifID` | The unique identifier for a user. |

<br>

### Sample Request

```
localhost:5000/notifications?notifID=veagvtrhfvrtbhtvg
```

### Sample Response

#### Success

##### Toggled the switch

```js
"status": 200,
"data": {
    "data": null,
    "description": "Sent read receipt"
}
```

#### Failure

##### Notif doesn't exist

```js
"status": 404,
"data": {
    "data": null,
    "description": "Couldn't find the requested notification"
}
```
