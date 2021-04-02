# -*- coding: utf-8 -*-
"""
Created on Fri Mar 26 01:47:13 2021

@author: angel
"""

from flask import request
from flask_login import login_required
from flask_pymongo import ObjectId
from .utils import serverResponse, validate_required_info, check_duplicate
import datetime


# For the staff to edit tenant info
def change_tenant_info(app, mongo):
    def find_tenant_by_id(tenantID):
        try:
            tenant = mongo.db.tenant.find_one({"_id" : tenantID})
            
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
                         "stallName", "companyName", 
                         "companyPOCName", "companyPOCEmail",
                         "unitNo", "fnb",
                         "staffID", "tenantDateStart", "tenantDateEnd"]
        
        try:
            if request.method == "POST":
                tenant_info = request.json
            
            #validate and check duplicate email
            validated, message = validate_required_info(tenant_info, required_info)
            duplicate = check_duplicate(mongo, "tenant", "email", tenant_info["email"])
            
            if validated and not duplicate:
                data = {
                        "_id": str(ObjectId()),
                        "name":tenant_info["name"],
                        "email":tenant_info["email"].upper(),
                        "pswd":tenant_info["pswd"],
                        "institutionID":tenant_info["institutionID"],
                        "stall":{
                            "name":tenant_info["stallName"],
                            "companyName":tenant_info["companyName"],
                            "companyPOC":{
                                "name":tenant_info["companyPOCName"],
                                "email":tenant_info["companyPOCWmail"].upper()},
                            "address":{
                                "blk":tenant_info.get("blk", None),
                                "street":tenant_info.get("street", None),
                                "bldg":tenant_info.get("bldg", None),
                                "unitNo":tenant_info["unitNo"],
                                "zipCode": tenant_info.get("zipCode", None)},
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
                #send appropriate error messages
                if not validated and not duplicate:
                    return serverResponse(message, 200, "Insufficient/Error in data to add new tenant")
                elif validated and duplicate:
                    return serverResponse(None, 404, "Duplicate email found")
                else:
                    return serverResponse(message, 404, "Duplicate email and insufficient/error in data to add new tenant")
        except:
            return serverResponse(None, 404, "No response received")
        
        return serverResponse(None, 201, "Tenant Added")
    
    @app.route("/tenant/<tenantID>" , methods = ["GET", "DELETE"])
    @login_required
    def get_tenant(tenantID):
        if request.method == "GET":
            tenant_found, tenant_info = find_tenant_by_id(tenantID)
            
            if tenant_found is not None:
                if tenant_found:
                    tenant_info["_id"] = tenantID
                    return serverResponse(tenant_info, 200, "Success")
                else:
                    return serverResponse(None, 404, "No matching tenant ID found")
            else:
                return serverResponse(None, 404, "Error connecting to server")

        elif request.method == "DELETE":
            tenant_found, tenant_info = find_tenant_by_id(tenantID)
        
            if tenant_found is not None:
                if tenant_found:
                    try:
                        mongo.db.tenant.delete_one( {"_id": tenantID})
                    except:
                        return serverResponse(None, 404, "Error connecting to server")
                    
                    #check if tenant is still there after deleting
                    tenant_found, tenant_info = find_tenant_by_id(tenantID)
                    
                    if not tenant_found:
                        return serverResponse(None, 200, "Tenant with ID " + tenantID + " deleted")
                    else:
                        return serverResponse(None, 404, "Error deleting the tenant")
                else:
                    return serverResponse(None, 404, "No matching tenant ID found")
            else:
                return serverResponse(None, 404, "Error connecting to server")