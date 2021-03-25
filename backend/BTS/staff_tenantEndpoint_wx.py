# -*- coding: utf-8 -*-
"""
Created on Fri Mar 26 01:47:13 2021

@author: angel
"""

from flask import Flask, request, session
from flask_pymongo import PyMongo
from utils import successMsg, failureMsg, successResponse, failureResponse

app = Flask(__name__)

#local host
#app.config["MONGO_URI"] = "mongodb://localhost:27017/BTS"

#hosting online
connection_string = "mongodb+srv://admin:admin@bts.vjyxq.mongodb.net/BTS?retryWrites=true&w=majority"
app.config["MONGO_URI"] = connection_string

mongo = PyMongo(app)

"""
@app.route("/tenant/delete/<tenantID>", methods = ["GET"])
def delete_tenant(tenantID):
    
    try:
        tenant = mongo.db.tenant.find_one(
            {"_id": tenantID})  
        
        if tenant is not None:
            result = []
            
        else:
            result = []
        
        
    except:
         output = {
                "status" : 404,
                "description" : "Tenant cannot be deleted",
                "data" : []}
    
    json_data = dumps(output)
    return json_data
"""

#For the staff to add new tenant
@app.route("/tenant/add", methods = ["POST"])
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
                        f"added data")
                
            return successResponse(message)
    
    except:
         return failureResponse(failureMsg(f"No response received", 404), 404)

#Flask test
@app.route('/')
def hello_world():
    online_users = mongo.db.institution.find({"online": True})
    return "Hello World!"

if __name__ == "__main__":
    app.run()