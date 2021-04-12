# -*- coding: utf-8 -*-
"""
Created on Fri Mar  5 02:46:03 2021

@author:wx
"""

from .utils import serverResponse
from flask_login import login_required
from flask import request



def addGetFormEndpoints(app, mongo):
    # Able to retrieve tenant and audit form information and return as json string

    @app.route("/tenants", methods=["GET"])
    @login_required
    def get_tenants_from_institution():
        if request.method == "GET":
            try:
                institutionID = request.args.get("institutionID", None)
                if institutionID is None:
                    return serverResponse(None, 200, "Missing institutionID")
                
                tenants = mongo.db.tenant.find({"institutionID": institutionID})
    
                result = [{
                        'tenantID': str(tenant['_id']),
                        'stallName': tenant["stallName"],
                        'fnb': tenant["fnb"]
                    }
                    for tenant in tenants]
    
                if len(result) > 0:
                    return serverResponse(result, 200, "Success")
                else:
                    return serverResponse(None, 200, "No tenant with the institution ID found")
    
            except:
               return serverResponse(None, 404, "Error in connection")

    @app.route("/auditForms", methods=["GET"])
    @login_required
    def get_audit_form():
        if request.method == "GET":
            try:
                formType = request.args.get("formType", None)
                
                if formType is None:
                    return serverResponse(None, 200, "Missing form type")
                
                form = mongo.db.auditFormTemplate.find_one(
                    {"type": formType})
    
                checklist = {}
                if form is not None:
                    for category in form["questions"]:
                        checklist[category] = form["questions"][category]
    
                    result = {
                        "_id": str(form["_id"]),
                        "type": form["type"],
                        "questions": checklist
                    }
    
                    return serverResponse(result, 200, "Success")
                else:
                    return serverResponse(None, 200, "No matching form")
    
            except:
                return serverResponse(None, 404, "Internal Error")

    