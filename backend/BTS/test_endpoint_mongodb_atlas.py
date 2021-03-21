from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo
from bson.json_util import dumps, loads

app = Flask(__name__)

#local host
#app.config["MONGO_URI"] = "mongodb://localhost:27017/BTS"

#hosting online
connection_string = "mongodb+srv://admin:admin@bts.vjyxq.mongodb.net/BTS?retryWrites=true&w=majority"
app.config["MONGO_URI"] = connection_string

mongo = PyMongo(app)

def return_find_data_json(result):
    output = {};
    
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
                
        output = return_find_data_json(checklist)
        
        
    except:
         output = {
                "status" : 404,
                "description" : "unspecified connection/data error",
                "data" : []}
    
    json_data = dumps(output)
    return json_data

#Flask test
@app.route('/')
def hello_world():
    online_users = mongo.db.institution.find({"online": True})
    return "Hello World!"

if __name__ == "__main__":
    app.run()