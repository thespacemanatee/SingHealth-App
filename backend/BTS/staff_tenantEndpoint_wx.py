# -*- coding: utf-8 -*-
"""
Created on Fri Mar 26 01:47:13 2021

@author: angel
"""

from flask import request
from flask_login import login_required
from flask_pymongo import ObjectId
from .utils import serverResponse, validate_required_info
import datetime


# For the staff to edit tenant info
def change_tenant_info(app, mongo):
    def find_tenant_by_id(tenantID):
        try:
            tenant = mongo.db.tenant.find_one({"_id" : ObjectId(tenantID)})
            
            if tenant is not None:
                return True, tenant
            else:
                return False, None
        except:
            return None, None
    
    @app.route("/tenant", methods = ["POST"])
    @login_required
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
                    return serverResponse(None, 404, "Cannot upload data to server")
            else:
                return serverResponse(message, 200, "Insufficient/Error in data to add new tenant")

        except:
            return serverResponse(None, 404, "No response received")
        
        return serverResponse(None, 201, "Tenant Added")
    
    @app.route("/tenant/<tenantID>" , methods = ["GET"])
    @login_required
    def get_tenant(tenantID):
        tenant_found, tenant_info = find_tenant_by_id(tenantID)
        
        if tenant_found is not None:
            if tenant_found:
                tenant_info["_id"] = tenantID
                return serverResponse(tenant_info, 200, "Success")
            else:
                return serverResponse(None, 404, "No matching tenant ID found")
        else:
            return serverResponse(None, 404, "Error connecting to server")
        
    @app.route("/tenant/<tenantID>" , methods = ["DELETE"])
    @login_required
    def delete_tenant(tenantID):
        tenant_found, tenant_info = find_tenant_by_id(tenantID)
    
        if tenant_found is not None:
            if tenant_found:
                try:
                    mongo.db.tenant.delete_one( {"_id": ObjectId(tenantID)});
                except:
                    return serverResponse(None, 404, "Error connecting to server")
                
                return serverResponse(None, 200, "Tenant with ID " + tenantID + " deleted")
            else:
                return serverResponse(None, 404, "No matching tenant ID found")
        else:
            return serverResponse(None, 404, "Error connecting to server")

