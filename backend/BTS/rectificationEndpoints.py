from .utils import serverResponse, send_push_message, send_email_notif
from .constants import SGT_TIMEZONE
from flask import request
from flask_login import login_required
from pytz import timezone, utc
import iso8601

requiredPatchKeys = ["category", "index"]
allowedTenantPatchKeys = ["rectificationImages",
                          "rectificationRemarks",
                          "requestForExt"]

allowedStaffPatchKeys = ["rectified", "acceptedRequest", "deadline"]


def validatePatchRequest(patches, allowedPatchKeys, requiredPatchKeys):
    for formType, patchList in patches.items():
        for patch in patchList:
            noInvalidKey = all(
                map(lambda x: x in allowedPatchKeys, patch.keys()))
            sufficientKeys = all(
                map(lambda x: x in patch.keys(), requiredPatchKeys))
            if not noInvalidKey:
                return False, "Invalid keys provided. You are trying to modify fields that are locked for modifying."

            if not sufficientKeys:
                return False, "Unable to narrow down the line item in the audit that you want to edit."
    return True, "All patches verified"


def databaseAcceptsChanges(patches, mongo, auditChecklists, allowUpdateOfRectifiedItems=False):
    # Find the audit metadata in the DB

    for formType, patchList in patches.items():
        try:
            formID = auditChecklists[formType]
        except KeyError:
            return serverResponse(None, 400, f"The form you were trying({formType}) to edit does not exist.")

        selectedAuditForm = mongo.db.filledAuditForms.find_one({"_id": formID})

        for patch in patchList:
            compliant = selectedAuditForm["answers"][patch["category"]
                                                     ][patch["index"]]["answer"]
            if compliant:
                msg = {
                    "formType": formType,
                    "patch": patch,
                    "description": "You can't edit a line item that is already marked as compliant"
                }
                return False, serverResponse(
                    msg,
                    400,
                    "You are editing a line item that was previously marked as compliant"
                )

            elif not allowUpdateOfRectifiedItems:
                # Check if the particular line item has already been rectified
                category = patch["category"]
                index = patch["index"]
                answers = selectedAuditForm["answers"]
                alreadyRectified = answers[category][index].get(
                    "rectified", False)
                if alreadyRectified:
                    msg = {
                        "formType": formType,
                        "patch": patch,
                        "description": "You can't edit a line item that has already been rectified."
                    }
                    return False, serverResponse(
                        msg,
                        400,
                        "You are editing a line item that has already been rectified."
                    )

    return True, None


def mongoUpdateGivenFields(mongo, patches, fields, auditChecklists):
    def mongoUpdateOne(mongo, formID, lineItem, newValue, field):
        result = mongo.db.filledAuditForms.update_one(
            {"_id": formID},
            {
                "$set": {
                    lineItem + field: newValue
                }

            }
        )
        return result

    patchResults = []
    for formType, patchList in patches.items():
        for patch in patchList:
            formID = auditChecklists[formType]
            lineItem = "answers." + \
                patch["category"] + "." + str(patch["index"]) + "."
            patchStatuses = []
            for field in fields:
                if patch.get(field, None) == None:
                    continue
                elif field == allowedStaffPatchKeys[2]:
                    newValue = iso8601.parse_date(patch[field])
                else:
                    newValue = patch[field]

                result = mongoUpdateOne(
                    mongo, formID, lineItem, newValue, field)

                try:
                    patchStatuses.append(result.acknowledged)
                except AttributeError:
                    pass

            patchResult = {"patch": patch, "status": all(patchStatuses)}
            patchResults.append(patchResult)
    return patchResults


def percentageRectification(allQuestions):
    numNCs = len(list(filter(
        lambda x: x["answer"] == False,
        allQuestions)))
    numRectifiedNCs = len(list(filter(
        lambda x: x["answer"] == False and x.get("rectified", None) == True,
        allQuestions)))
    percentRectification = numRectifiedNCs / numNCs

    return percentRectification


def addRectificationEndpts(app, mongo):
    @app.route("/audits/<auditID>/tenant", methods=['PATCH'])
    # @login_required
    def patch_audit_tenant(auditID):
        if request.method == "PATCH":
            patches = request.json
            valid, description = validatePatchRequest(
                patches,
                allowedTenantPatchKeys + requiredPatchKeys,
                requiredPatchKeys
            )

            if not valid:
                return serverResponse(None, 400, description)

            selectedAudit = mongo.db.audits.find_one({"_id": auditID})
            staff = mongo.db.staff.find_one(
                {"_id": selectedAudit["staffID"]}
            )
            tenant = mongo.db.tenant.find_one(
                {"_id": selectedAudit["tenantID"]}
            )
            tenantStallName = tenant["stallName"]
            staffExpoTokens = staff.get("expoToken")

            auditChecklists = selectedAudit["auditChecklists"]

            changesAccepted, errorResponse = databaseAcceptsChanges(
                patches,
                mongo,
                auditChecklists
            )
            if not changesAccepted:
                return errorResponse

            patchResults = mongoUpdateGivenFields(
                mongo,
                patches,
                allowedTenantPatchKeys,
                auditChecklists
            )
            if staffExpoTokens != None:
                for device in staffExpoTokens:
                    try:
                        send_push_message(device, tenantStallName,
                                          "has reviewed an audit form")
                    except:
                        # print("Some error detected")
                        continue

            date = selectedAudit['date']
            if date.tzinfo is None or date.tzinfo.utcoffset(date) is None:
                date = utc.localize(date)
            
            date = date.astimezone(timezone(SGT_TIMEZONE))



            summary = ""
            for formtype, patchList in patches.items():
                summary += f"Form:\t{formtype}\n"
                for patch in patchList:
                    part = ""
                    part += f"Category:\t{patch['category']}\n"
                    part += f"Line item no.:\t{patch['index']}\n"
                    part += f"Note: Added \t{len(patch.get('rectificationImages',[]))} images to show rectification\n"
                    part += f"Remarks:\t{patch.get('rectificationRemarks', None)}\n"
                    part += f"Requested for extension:\t{patch.get('requestForExt',False)}"
                    summary += part
                summary += "\n\n"

            send_email_notif(
                app,
                staff["email"],
                "Audit Results",
                f"""Dear {staff['name']},

Your tenant, {tenant['stallName']}, has submitted a review for one of his NCs for the audit dated {date.strftime('%d %B %Y, %I:%M %p')}. 
Please check your app for details.

{summary}
This email is auto generated. No signature is required.
You do not have to reply to this email."""
            )

            checklistType = list(patches.keys())[0]
            patchForNotif = patches[checklistType][0]
            notif = {
                    "userID": staff["_id"],
                    "auditID": auditID,
                    "stallName": tenant["stallName"],
                    "type": "patch",
                    "message": {
                        "checklistType": checklistType,
                        "index": patchForNotif["index"],
                        "section": patchForNotif["category"]
                    }
                }
            result = mongo.db.notifications.insert_one(notif)
            if not result.acknowledged:
                print("PATCH ENDPT: Failed to add POST nofitication to DB")
            else:
                print("Added notif to the DB")
            return serverResponse(patchResults, 200, "Changes sent to the database.")

    @app.route("/audits/<auditID>/staff", methods=['PATCH'])
    # @login_required
    def patch_audit_staff(auditID):
        if request.method == "PATCH":
            patches = request.json
            valid, description = validatePatchRequest(
                patches,
                allowedStaffPatchKeys + requiredPatchKeys,
                requiredPatchKeys
            )
            if not valid:
                return serverResponse(None, 400, description)

            selectedAudit = mongo.db.audits.find_one({"_id": auditID})
            auditChecklists = selectedAudit["auditChecklists"]
            institution = selectedAudit["institutionID"]
            tenantID = selectedAudit["tenantID"]

            changesAccepted, errorResponse = databaseAcceptsChanges(
                patches,
                mongo,
                auditChecklists,
                True
            )
            if not changesAccepted:
                return errorResponse

            patchResults = mongoUpdateGivenFields(
                mongo,
                patches,
                allowedStaffPatchKeys,
                auditChecklists
            )

            # retrieve the amended audit forms again starting from auditmetadata
            allQuestions = []
            for formType, formID in auditChecklists.items():
                form = mongo.db.filledAuditForms.find_one({"_id": formID})
                if form:
                    for answerList in form["answers"].values():
                        allQuestions.extend(answerList)

            percentRectification = percentageRectification(allQuestions)

            # Update audit metadata
            percentRectDict = {"rectificationProgress": percentRectification}
            result = mongo.db.audits.update_one(
                {"_id": auditID},
                {
                    "$set": percentRectDict
                }
            )

            ack = percentRectDict.copy()
            ack["patchResults"] = patchResults
            ack["updatedRectProgress"] = result.acknowledged

            tenant = mongo.db.tenant.find_one({"_id": tenantID})
            if tenant:
                if (expoTokens := tenant.get("expoToken")) != None:
                    for device in expoTokens:
                        try:
                            send_push_message(device, institution,
                                              "has reviewed your rectifications")
                        except:
                            # print("Some error detected")
                            continue

                date = selectedAudit['date']
                summary = ""
                for formtype, patchList in patches.items():
                    summary += f"Form:\t{formtype}\n"
                    for patch in patchList:
                        part = ""
                        part += f"Category:\t{patch['category']}\n"
                        part += f"Line item no.:\t{patch['index']}\n"
                        part += f"Deadline:\t{patch.get('deadline', 'No changes')}\n"
                        part += f"Rectified:\t{patch.get('rectified',False)}\n"
                        part += f"Granted request for extension:\t{patch.get('acceptedRequest',False)}"
                        summary += part
                    summary += "\n\n"


                
                if date.tzinfo is None or date.tzinfo.utcoffset(date) is None:
                    date = utc.localize(date)
                date = date.astimezone(timezone(SGT_TIMEZONE))
                    
                send_email_notif(
                    app,
                    tenant["email"],
                    "Audit Results",
                    f"""Dear {tenant['stallName']},

{institution} has submitted a review for your rectifications for your audit dated {date.strftime('%d %B %Y, %I:%M %p')}. 
Please check your app for details. Below is an overview:

{summary}
This email is auto generated. No signature is required. You do not have to reply to this email."""
                )
                try:
                    print(patches)
                    checklistType = list(patches.keys())[0]
                    patchForNotif = patches[checklistType][0]
                    notif = {
                            "userID": tenant["_id"],
                            "auditID": auditID,
                            "stallName": tenant["stallName"],
                            "type": "patch",
                            "message": {
                                "checklistType": checklistType,
                                "index": patchForNotif["index"],
                                "section": patchForNotif["category"],
                                "rectified": patchForNotif.get("rectified", False)
                            }
                        }
                    result = mongo.db.notifications.insert_one(notif)
                    if not result.acknowledged:
                        print("PATCH ENDPT: Failed to add POST nofitication to DB")
                    else:
                        print("Added notif to the DB")
                except KeyError:
                    print("KEYERROR LA BODOH")
            return serverResponse(
                ack,
                200,
                "Updates submitted successfully. "
            )
