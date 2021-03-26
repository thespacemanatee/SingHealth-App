# -*- coding: utf-8 -*-
"""
Created on Fri Mar 26 01:47:13 2021

@author: angel
"""

from flask import Flask, request
from utils import successMsg, failureMsg, successResponse, failureResponse

#For the staff to edit tenant info
def change_tenant_info(app, mongo):
    
    @app.route("/tenant", methods = ["POST"])
    def add_tenant():
        complete_data = False
        try:
            if request.method == "POST":
                tenant_info = request.json
                
                #print(len(tenant_info))
                if len(tenant_info) == 0:
                    message = successMsg(
                            f"No data received")
                else:
                    try:
                        if len(tenant_info) == 14:
                            data = {
                                "name":tenant_info["name"],
                                "email":tenant_info["email"],
                                "pswd":tenant_info["pswd"],
                                "institutionID":tenant_info["institutionID"],
                                "stall":{
                                    "name":tenant_info["stall_name"],
                                    "companyName":tenant_info["company_name"],
                                    "companyPOC":{
                                        "name":tenant_info["company_POC_name"],
                                        "email":tenant_info["company_POC_email"],
                                    "group":tenant_info["group"],
                                    "address":{
                                        "unitNo":tenant_info["unit_no"],
                                        "stall":tenant_info["stall_number"]},
                                    "fnb":tenant_info["fnb"],
                                    "createdBy":tenant_info["staffID"],
                                    "dateCreated":tenant_info["date"]}
                                  }}
                            
                            complete_data = True
                            
                        elif len(tenant_info) == 12:
                            data = {
                                "name":tenant_info["name"],
                                "email":tenant_info["email"],
                                "pswd":tenant_info["pswd"],
                                "institutionID":tenant_info["institutionID"],
                                "stall":{
                                    "name":tenant_info["stall_name"],
                                    "companyName":tenant_info["company_name"],
                                    "companyPOC":{
                                        "name":tenant_info["company_POC_name"],
                                        "email":tenant_info["company_POC_email"],
                                    "group": None,
                                    "address":{
                                        "unitNo":tenant_info["unit_no"]},
                                    "fnb":tenant_info["fnb"],
                                    "createdBy":tenant_info["staffID"],
                                    "dateCreated":tenant_info["date"]}
                                  }}
                            
                            complete_data = True
                            
                        else:
                            message = successMsg(f"Insufficient data to add new tenants")
                    except:
                        message = successMsg(f"Error in data")
                    
                    if complete_data:
                        try:
                            mongo.db.tenant.insert_one(data)
                        except:
                            return failureResponse(failureMsg(f"Cannot upload data to server", 404), 404)
                                
                        message = successMsg(
                            f"New tenant added")
                        #print("updated database")
                    
                return successResponse(message)
        
        except:
             return failureResponse(failureMsg(f"No response received", 404), 404)


