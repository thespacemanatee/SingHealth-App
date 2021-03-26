# -*- coding: utf-8 -*-
"""
Created on Fri Mar  5 02:46:03 2021

@author:wx
"""

from flask import jsonify, make_response
import os


def return_find_data_json(result):
    output = {}

    # if data is found
    if len(result) > 0:
        output = {
            "status": 200,
            "description": "success",
            "data": result}
    else:
        output = {
            "status": 200,
            "description": "no matching data",
            "data": {}}

    return output


def addWenXinEndpoints(app, mongo):
    # Able to retrieve tenant and audit form information and return as json string
    @app.route("/tenants/<institutionID>", methods=["GET"])
    def get_tenants_from_institution(institutionID):
        try:
            tenants = mongo.db.tenant.find({"institutionID": institutionID})

            result = [{
                'tenantID': tenant['_id'],
                'stallName': tenant["stall"]["name"]
            }
                for tenant in tenants]

            output = return_find_data_json(result)

        except:
            output = {
                "status": 404,
                "description": "error in connection",
                "data": []}

        response = make_response(jsonify(output["data"]), output['status'])
        response.status = output["description"]
        response.headers.add('Access-Control-Allow-Headers',
                             "Origin, X-Requested-With, Content-Type, Accept, x-auth")
        response.headers["Access-Control-Allow-Origin"] = os.getenv(
            'WEB_APP_URI')
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response

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
                    "_id": form["_id"],
                    "type": form["type"],
                    "questions": checklist
                }
            else:
                result = {}

            output = return_find_data_json(result)

        except:
            output = {
                "status": 404,
                "description": "unspecified connection/data error",
                "data": {}}

        response = make_response(jsonify(output["data"]), output['status'])
        response.status = output["description"]
        response.headers.add('Access-Control-Allow-Headers',
                             "Origin, X-Requested-With, Content-Type, Accept, x-auth")
        response.headers["Access-Control-Allow-Origin"] = os.getenv(
            'WEB_APP_URI')
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response
