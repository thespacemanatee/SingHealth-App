# -*- coding: utf-8 -*-
"""
Created on Fri Mar 26 01:47:13 2021

@author: angel
"""

from flask import request
from wx_utils import return_response, return_find_data_json, validate_required_info
import datetime


#For the staff to edit tenant info
def change_tenant_info(app, mongo):
    
    @app.route("/tenant", methods = ["POST"])
    def add_tenant():
        required_info = [ "name", "email", "pswd", "institutionID", 
                         "stall_name", "company_name", 
                         "company_POC_name", "company_POC_email",
                         "unit_no", "fnb",
                         "staffID", "tenantDateStart", "tenantDateEnd"]
        
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
                        "dateCreated":datetime.datetime.now().isoformat(),
                        "tenantDateStart": tenant_info.get("tenantDateStart", None),
                        "tenantDateEnd": tenant_info.get("tenantDateEnd", None)
                         }
                
                try:
                    mongo.db.tenant.insert_one(data)
                except:
                    return return_response("Cannot upload data to server", code = 404)
            else:
                return return_response("Insufficient/Error in data to add new tenant", data = message)

        except:
            return return_response("No response received", code = 404)
        
        return return_response("Tenant Added")


