from .utils import serverResponse, send_push_message, send_email_notif
from .constants import MAX_NUM_IMAGES_PER_NC, SGT_TIMEZONE
from flask import request, make_response, jsonify
from flask_login import login_required
from pymongo.errors import DuplicateKeyError
from datetime import datetime
from pytz import timezone
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
    def mongoUpdateOne(mongo, formID, lineItem, patch, field):
        if patch.get(field, None) != None:
            result = mongo.db.filledAuditForms.update_one(
                {"_id": formID},
                {
                    "$set": {
                        lineItem + field: patch[field]
                    }

                }
            )
            return result
        return None

    patchResults = []
    for formType, patchList in patches.items():
        for patch in patchList:
            formID = auditChecklists[formType]
            lineItem = "answers." + \
                patch["category"] + "." + str(patch["index"]) + "."
            patchStatuses = []
            for field in fields:
                result = mongoUpdateOne(mongo, formID, lineItem, patch, field)

                try:
                    patchStatuses.append(result.acknowledged)
                except AttributeError:
                    pass

            patchResult = {"patch": patch, "status": all(patchStatuses)}
            patchResults.append(patchResult)
    return patchResults



def addRectificationEndpts(app, mongo):
    @app.route("/audits/<auditID>/tenant", methods=['PATCH'])
    @login_required
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
            tenantStallName = tenant["stall"]["name"]
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
                        print("Some error detected")
                        continue
            
            date = selectedAudit['date']
            if date.tzinfo is None or date.tzinfo.utcoffset(date) is None:
                date = timezone(SGT_TIMEZONE).localize(date)        
            
            send_email_notif(
                app,
                staff["email"], 
                "Audit Results", 
                f"""Dear {staff['name']},
                    Your tenant, {tenant['stall']['name']}, has submitted a review for one of his NCs for the audit dated {date.strftime('%d %B %Y, %I:%M %p')}. 
                    Please check your app for details.
                    This email is auto generated. No signature is required.
                    You do not have to reply to this email."""
                )
            return serverResponse(patchResults, 200, "Changes sent to the database.")

    @app.route("/audits/<auditID>/staff", methods=['PATCH'])
    @login_required
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
                for answerList in form["answers"].values():
                    allQuestions.extend(answerList)

            numNCs = len(list(filter(
                lambda x: x["answer"] == False,
                allQuestions)))
            numRectifiedNCs = len(list(filter(
                lambda x: x["answer"] == False and x["rectified"] == True,
                allQuestions)))
            percentRectification = numRectifiedNCs / numNCs

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
                            print("Some error detected")
                            continue
                
                date = selectedAudit['date']
                if date.tzinfo is None or date.tzinfo.utcoffset(date) is None:
                    date = timezone(SGT_TIMEZONE).localize(date)  
                send_email_notif(
                    app,
                    tenant["email"], 
                    "Audit Results", 
                    f"""Dear {tenant['stall']['name']},
                        {institution} has submitted a review for your rectifications for your audit dated {date.strftime('%d %B %Y, %I:%M %p')}. 
                        Please check your app for details.
                        This email is auto generated. No signature is required.
                        You do not have to reply to this email."""
                    )
            return serverResponse(
                ack,
                200,
                "Updates submitted successfully. "
            )

           