# -*- coding: utf-8 -*-
"""
Created on Fri Mar  5 02:46:03 2021

@author:wx
"""

from .utils import serverResponse, validate_required_info

def addWenXinEndpoints(app, mongo):
    # Able to retrieve tenant and audit form information and return as json string
    @app.route("/tenants/<institutionID>", methods=["GET"])
    def get_tenants_from_institution(institutionID):
        try:
            tenants = mongo.db.tenant.find({"institutionID": institutionID})

            result = [{
                'tenantID': str(tenant['_id']),
                'stallName': tenant["stall"]["name"]
            }
                for tenant in tenants]

            if len(result) > 0:
                output = serverResponse(result, 200, "Success")
            else:
                output = serverResponse(None, 404, "No tenant with the institution ID found")

        except:
            output = serverResponse(None, 404, "Error in connection")

        return output

    @app.route("/auditForms/<form_type>", methods=["GET"])
    def get_audit_form(form_type):
        try:
            form = mongo.db.auditFormTemplate.find_one(
                {"type": form_type})

            checklist = {}
            if form is not None:
                for category in form["questions"]:
                    checklist[category] = form["questions"][category]

                result = {
                    "_id": str(form["_id"]),
                    "type": form["type"],
                    "questions": checklist
                }

                output = serverResponse(result, 200, "Success")
            else:
                output = serverResponse(None, 404, "No matching form")

        except:
            output = serverResponse(None, 404, "Error in connection")

        return output
