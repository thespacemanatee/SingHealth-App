# -*- coding: utf-8 -*-
"""
Created on Fri Mar  5 02:46:03 2021

@author:wx
"""

from flask import jsonify, make_response
import json


### Edited the segment
from flask import Flask
from flask_pymongo import PyMongo
from bson.json_util import dumps

app = Flask(__name__)

#local host
#app.config["MONGO_URI"] = "mongodb://localhost:27017/BTS"

#hosting online
connection_string = "mongodb+srv://admin:admin@bts.vjyxq.mongodb.net/BTS?retryWrites=true&w=majority"
app.config["MONGO_URI"] = connection_string


mongo = PyMongo(app)


def return_find_data_json(result):
    output = {}
    
    #if data is found
    if len(result) > 0 :
        output = {
            "status" : 200,
            "description" : "success",
            "data" : result}
    else:
        output = {
            "status" : 200,
            "description" : "no matching data",
            "data" : []}
        
    return output     

#Able to retrieve tenant and audit form information and return as json string
@app.route("/tenants/<institutionID>", methods = ["GET"])
def get_tenants_from_institution(institutionID): 
    try:
        tenants = mongo.db.tenant.find({"institutionID": institutionID})

        result = [{
            'tenantID' : tenant['_id'], 
            'stallName' : tenant["stall"]["name"]
            }
                  for tenant in tenants]
        
        output = return_find_data_json(result)
            
    except:
        output = {
                "status" : 404,
                "description" : "error in connection",
                "data" : []}
    
    json_data = dumps(output)
    return json_data

@app.route("/auditForms/<form_type>", methods = ["GET"])
def get_audit_form(form_type):
    
    try:
        form = mongo.db.auditFormTemplate.find_one(
            {"type": form_type})  
        
        checklist = {}
        if form is not None:
            for category in form["questions"]:
                checklist[category] = form["questions"][category]
            
            result = [{
                "_id" : form["_id"],
                "type" : form["type"],
                "questions" : checklist
                }]
        else:
            result = []

        output = return_find_data_json(result)
        
        
    except:
         output = {
                "status" : 404,
                "description" : "unspecified connection/data error",
                "data" : []}
    
    json_data = dumps(output)
    return json_data

### end of added segment 

def addWenXinEndpoints(app, mongo):
    #Able to retrieve tenant and audit form information and return as json string
    @app.route("/tenants/<institutionID>", methods = ["GET"])
    def get_tenants_from_institution(institutionID): 
        try:
            tenants = mongo.db.tenant.find({"institutionID": institutionID})

            result = [{
                'tenantID' : tenant['_id'], 
                'stallName' : tenant["stall"]["name"]
                }
                    for tenant in tenants]
            
            #if data is found
            if len(result) > 0 :
                output = {
                    "status" : 200,
                    "description" : "success",
                    "data" : result}
            else:
                output = {
                    "status" : 200,
                    "description" : "no matching data",
                    "data" : []}
                
            
        except:
            output = {
                    "status" : 404,
                    "description" : "error in connection",
                    "data" : []}
        
        response = make_response(jsonify(output), output['status'])
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:19006"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response

    @app.route("/auditForms/<form_type>", methods = ["GET"])
    def get_audit_form(form_type):
        
        try:
            form = mongo.db.auditFormTemplate.find_one(
                {"type": form_type, "currentForm": True})  
            
            checklist = []
            if form is not None:
                #access the questions with each categories
                for key, value in form["categories"].items():
                    value = {
                        "category" : value,
                        "questions" : form[key]["questions"]
                        }
                    checklist.append(value)
                    
                output = {
                    "status" : 200,
                    "description" : "success",
                    "data" : {
                        "formID" : form["_id"],
                        "type" : form["type"],
                        "checklist" : checklist
                        }
                    }
                
            else:
                output = {
                    "status" : 200,
                    "description" : "no matching form",
                    "data" : {}
                    }
                
        except:
            output = {
                    "status" : 404,
                    "description" : "unspecified connection/data error",
                    "data" : []}
        
        response = make_response(jsonify(output), output['status'])
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:19006"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response

