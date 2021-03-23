from datetime import datetime
from flask import request, session
from flask_login import login_required
from .utils import successMsg, successResponse, failureMsg, failureResponse


def addRecentAuditsEndpoints(app, mongo):
    @app.route("/audits/unrectified/recent/tenant/<tenantID>/<int:daysBefore>", methods=['GET'])
    @login_required
    def unrectified_audits_staff(tenantID, daysBefore = 0):
        if request.method == 'GET':
            if session["account_type"] == "staff":                
                queryDict = {}
                queryDict["tenantID"] = tenantID
                queryDict["rectificationProgress"] = {"$lt": 1}
                if daysBefore > 0:
                    queryDict["date"] = {"$gt": datetime.utcnow() - datetime.timedelta(days=daysBefore)}

                audits = mongo.db.audits.find(queryDict)

                auditsList = []
                for index, audit in enumerate(audits):
                    temp = audit
                    temp["date"] = temp["date"].isoformat()
                    auditsList.append(temp)
                
                if len(auditsList) == 0:
                    return failureResponse(failureMsg("No matching forms", 404), 404)

                response = successMsg("Forms found")
                response["data"] = auditsList

                return successResponse(response)

            else:
                return failureResponse(failureMsg("You do not have access to this as you are not a staff", 403), 403)

    @app.route("/audits/unrectified/recent/staff/<institutionID>/<int:daysBefore>", methods=['GET'])
    @login_required
    def unrectified_audits_tenant(institutionID, daysBefore):
        if request.method == 'GET':
            if session["account_type"] == "tenant":
                queryDict = {}
                queryDict["institutionID"] = institutionID
                queryDict["rectificationProgress"] = {"$lt": 1}
                if daysBefore > 0:
                    queryDict["date"] = {"$gt": datetime.utcnow() - datetime.timedelta(days=daysBefore)}
                
                audits = mongo.db.audits.find(queryDict)
                auditsList = []
                for index, audit in enumerate(audits):
                    temp = audit
                    temp["date"] = temp["date"].isoformat()
                    auditsList.append(temp)
                
                if len(auditsList) == 0:
                    return failureResponse(failureMsg("No matching forms", 404), 404)
                
                response = successMsg("Forms found")
                response["data"] = auditsList

                return successResponse(response)

            else:
                return failureResponse(failureMsg("You do not have access to this as you are not a tenant", 403), 403)