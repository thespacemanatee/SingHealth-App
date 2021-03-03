from BTS.auditsEndpoint import processAuditdata
from BTS.utils import successMsg, failureMsg
from pymongo.errors import DuplicateKeyError
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


        try:
            mongo.db.audits.insert_one(auditMetaData)
            for filledForm in filledAuditForms.values():
                mongo.db.filledAuditForms.insert_one(filledForm)
        except DuplicateKeyError:
            return failureMsg("Form has already been uploaded", 400), 400

        return successMsg("Forms have been submitted"), 200