# -*- coding: utf-8 -*-
"""
Created on Fri Mar  5 02:46:03 2021

@author:wx
"""

from .utils import serverResponse, validate_required_info
from flask_login import login_required
from flask import request
import statistics
from datetime import date, datetime, timedelta

def addWenXinEndpoints(app, mongo):
    # Able to retrieve tenant and audit form information and return as json string

    @app.route("/tenants/<institutionID>", methods=["GET"])
    @login_required
    def get_tenants_from_institution(institutionID):
        try:
            tenants = mongo.db.tenant.find({"institutionID": institutionID})

            result = [{
                'tenantID': str(tenant['_id']),
                'stallName': tenant["stall"]["name"],
                'fnb': tenant["stall"]["fnb"]
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
    @login_required
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
                output = serverResponse(None, 200, "No forms found")

        except:
            output = serverResponse(None, 404, "Error in connection")

        return output

    @app.route("/auditTimeframe", methods=["GET"])
    @login_required
    def get_audit_by_timeframe():
        required_info = ["fromDate","toDate"]
        
        try:
            if request.method == "GET":
                timeframe = request.json
                if isinstance(timeframe, dict):
                    valid, missing_data = validate_required_info(timeframe, required_info)
                    
                    if(valid):
                        start_date = timeframe["fromDate"].replace(hour = 0, minute = 0, second = 0, microsecond = 0)
                        end_date = timeframe["toDate"].replace(hour = 23, minute = 59, second = 59, microsecond = 999999)
                        
                        query = { "date": {"$gt": start_date, "$lt": end_date}}
                        try:
                            audits = mongo.db.audits.find(query)
                        except: return serverResponse(None, 404, "Error in connection")
                            
                        if len(audits) > 0:
                            return serverResponse(None, 404, "No audit data found within the timeframe")
                        
                        date_arr, score_arr = []
                        for audit in audits:
                            date_arr.append(audit["date"])
                            score_arr.append(audit["score"])
                        
                        sorted_audit = {}
                        for i in range(len(date_arr)):
                            date_diff = date_arr[i] - start_date
                            sorted_audit.setdefault(start_date + timedelta(days = date_diff.days), []).append(score_arr[i])
                        
                        #pack data 
                        data = []
                        for date in sorted_audit.keys():
                            data.append({"date": date, "avgScore": round(statistics.mean(sorted_audit[date]),3)})
                        
                        return serverResponse(data, 200, "Success")
                    else:
                        return serverResponse(missing_data, 404, "Missing data or insufficent data")
                else:
                    return serverResponse(None, 404, "Input type error")
        except:
            return serverResponse(None, 404, "No response received")