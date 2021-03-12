# -*- coding: utf-8 -*-
"""
Created on Fri Mar  5 02:46:03 2021

@author:wx
"""

from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo
from bson import json_util, ObjectId
from bson.json_util import dumps, loads
import json

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/BTS"
mongo = PyMongo(app)

#Able to retrieve tenant and audit form information and return as json string
@app.route("/tenants/<institutionID>")
def get_tenants_from_institution(institutionID):
    
    try:
        tenants = mongo.db.tenant.find({"institutionID": institutionID})
        
        #print(type(tenants.explain()["nReturned"]))
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
            
        
    except PyMongo.errors.ConnectionError as e:
        output = {
                "status" : 404,
                "description" : "error in connection",
                "data" : []}
    
    json_data = dumps(output)
    return json_data

@app.route("/auditForms/<form_type>", methods = ["GET"])
def get_audit_form(form_type):
    audit_form = mongo.db.auditFormTemplate.find_one_or_404({"type": "fnb"})

    output_sanitized = json.loads(json_util.dumps(audit_form))
    print(output_sanitized)
    return '<p> '+ str(output_sanitized) +' </p>'

#Flask test
@app.route('/')
def hello_world():
    online_users = mongo.db.institution.find({"online": True})
    return "Hello World!"

if __name__ == "__main__":
    app.run()