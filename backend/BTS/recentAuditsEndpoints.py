from datetime import datetime
from flask import request, session
from flask_login import login_required
from .utils import serverResponse


def addRecentAuditsEndpoints(app, mongo):
    @app.route("/audits/unrectified/recent/tenant/<tenantID>/<int:daysBefore>", methods=['GET'])
    @login_required
    def unrectified_audits_tenant(tenantID, daysBefore=0):
        if request.method == 'GET':
            if session["account_type"] == "tenant":
                queryDict = {}
                queryDict["tenantID"] = tenantID
                queryDict["rectificationProgress"] = {"$lt": 1}
                if daysBefore > 0:
                    queryDict["date"] = {"$gt": datetime.utcnow(
                    ) - datetime.timedelta(days=daysBefore)}

                audits = mongo.db.audits.find(queryDict)

                auditsList = []
                for audit in audits:
                    auditObject = {"auditMetadata": audit}
                    audit["date"] = audit["date"]
                    tenant = mongo.db.tenant.find_one(
                        {"_id": audit["tenantID"]})
                    if tenant:
                        auditObject["stallName"] = tenant["stallName"]

                    auditsList.append(auditObject)

                if len(auditsList) == 0:
                    return serverResponse(None, 200, "No audits found")

                return serverResponse(auditsList, 200, "Audits found")

            else:
                return serverResponse(None, 403, "You do not have access to this as you are not a tenant")

    @app.route("/audits/unrectified/recent/staff/<institutionID>/<int:daysBefore>", methods=['GET'])
    @login_required
    def unrectified_audits_staff(institutionID, daysBefore):
        if request.method == 'GET':
            # if session["account_type"] == "staff":
            queryDict = {}
            queryDict["institutionID"] = institutionID
            queryDict["rectificationProgress"] = {"$lt": 1}
            if daysBefore > 0:
                queryDict["date"] = {
                    "$gt": datetime.utcnow() - datetime.timedelta(days=daysBefore)
                }

            audits = mongo.db.audits.find(queryDict)
            auditsList = []
            for audit in audits:
                auditMetadataObject = {"auditMetadata": audit}
                tenantID = audit["tenantID"]
                audit["date"] = audit["date"]
                tenant = mongo.db.tenant.find_one({"_id": tenantID})
                auditMetadataObject["stallName"] = ""
                if tenant:
                    tenantStallName = tenant["stallName"]
                    auditMetadataObject["stallName"] = tenantStallName
                auditsList.append(auditMetadataObject)

            if len(auditsList) == 0:
                return serverResponse(None, 200, "No forms found")

            return serverResponse(auditsList, 200, "Forms found")

            # else:
            #     return serverResponse(None, 403, "You do not have access to this page as you are not a staff")
