# -*- coding: utf-8 -*-
"""
Created on Fri Mar 26 01:47:13 2021

@author: angel
"""

from flask import Flask, request
from utils import serverResponse


def check_required_info(mydict, key_arr):
    missing_keys = []
    key_value_error = []
    
    if isinstance(mydict, dict) and isinstance(key_arr , list):
        for item in key_arr:
            #check if the dictionary contains keys
            if item not in mydict:
                missing_keys.append(item)
            
            else:
                if mydict[item] is None:
                    key_value_error.append(item)
                elif isinstance(mydict[item], str):
                    if len(mydict[item]) == 0:
                        key_value_error.append(item)
                        
        return missing_keys, key_value_error
    else:
        return None

def validate_required_info(mydict, key_arr):
    if check_required_info(mydict, key_arr) is not None:
        missing_keys , key_value_error = check_required_info(mydict, key_arr)
        if len(missing_keys) == 0 and len(key_value_error) == 0:
            return True, ""
        
        else:
            error_message = {}
            
            if len(missing_keys) > 0:
                error_message["missing_keys"] = missing_keys
                
            if len(key_value_error) > 0:
                error_message["key_value_error"] = key_value_error
                
        return False, error_message
    
    else:
        return False, "Wrong input parameter type"




#For the staff to edit tenant info
def change_tenant_info(app, mongo):
    
    @app.route("/tenant", methods = ["POST"])
    def add_tenant():
        complete_data = False
        required_info = [ "name", "email", "pswd", "institutionID", 
                         "stall_name", "company_name", 
                         "company_POC_name", "company_POC_email",
                         "unit_no", "fnb",
                         "staffID", "date", "tenantDateStart", "tenantDateEnd"]
        
        try:
            if request.method == "POST":
                tenant_info = request.json
                
            validated, message = validate_required_info(tenant_info, required_info)
            
            if validated:
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
                                "email":tenant_info["company_POC_email"]},
                            "address":{
                                "blk":tenant_info.get("blk", None),
                                "street":tenant_info.get("street", None),
                                "bldg":tenant_info.get("bldg", None),
                                "unitNo":tenant_info["unit_no"],
                                "zipcode": tenant_info.get("zipcode", None)},
                            "fnb":tenant_info["fnb"]},
                        "createdBy":tenant_info["staffID"],
                        "dateCreated":tenant_info["date"],
                        "tenantDateStart": tenant_info.get("tenantDateStart", None),
                        "tenantDateEnd": tenant_info.get("tenantDateEnd", None)
                         }
                
                try:
                    mongo.db.tenant.insert_one(data)
                except:
                    return serverResponse(None, 404, "Cannot upload data to server")
            else:
                return serverResponse(message, 200, "Insufficient/Error in data to add new tenant")

        except:
            return serverResponse(None, 404, "No response received")
        
        return serverResponse(None, 200, "Tenant Added")


