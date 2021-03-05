from BTS.auditsEndpoint import processAuditdata
from BTS.utils import successMsg, failureMsg, upload_image, download_image
from pymongo.errors import DuplicateKeyError
from flask import Flask, request, send_file
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

@app.route("/images", methods = ["GET", 'POST'])
def images():
    if request.method == 'POST':
        formdata = request.files
        images = formdata.getlist("images") 
        
        for image in images:
            imgName = image.filename
            upload_image(image, "singhealth", imgName)
        
        return successMsg("Pictures have successfully been uploaded"), 200
        




app.run(debug=True)