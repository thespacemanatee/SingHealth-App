from BTS.auditsEndpoint import processAuditdata
from BTS.utils import successMsg
from flask import Flask, request
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/singhealth"
mongo = PyMongo(app)


@app.route('/')
def hello_world():
    return 'Hello, good World!'


@app.route("/audits", methods = ['POST'])
def audits():
    if request.method == 'POST':
        auditData = request.json
        filledAuditForms , auditMetaData = processAuditdata(auditData)

        mongo.db.audits.insert_one(auditMetaData)
        mongo.db.filledAuditForms.insert_one(filledAuditForms)

        return successMsg("Forms have been submitted"), 200