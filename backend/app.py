from BTS.auditsEndpoint import processAuditdata
from BTS.utils import successMsg, failureMsg, upload_image, download_image
from BTS.constants import S3BUCKETNAME, MONGODB_URI
from pymongo.errors import DuplicateKeyError
from flask import Flask, request, send_file
from flask_pymongo import PyMongo
from flask_cors import CORS


app = Flask(__name__)
app.config["MONGO_URI"] = MONGODB_URI
mongo = PyMongo(app)
CORS(app)


@app.route('/')
def hello_world():
    return 'Hello, good World!'


@app.route("/audits", methods=['POST'])
def audits():
    if request.method == 'POST':
        auditData = request.json
        filledAuditForms, auditMetaData = processAuditdata(auditData)

        try:
            mongo.db.audits.insert_one(auditMetaData)
            for filledForm in filledAuditForms.values():
                mongo.db.filledAuditForms.insert_one(filledForm)
        except DuplicateKeyError:
            return failureMsg("Form has already been uploaded", 400), 400

        return successMsg("Forms have been submitted"), 200


@app.route("/images", methods=["GET", 'POST'])
def images():
    if request.method == 'POST':
        formdata = request.files
        images = formdata.getlist("images")

        for image in images:
            imgName = image.filename
            upload_image(image, S3BUCKETNAME, imgName)

        return successMsg("Pictures have successfully been uploaded"), 200

    elif request.method == "GET":
        details = request.json
        filename = details["image"]
        filetype = str(filename.split('.')[-1])
        imageObject = download_image(filename, S3BUCKETNAME)
        return send_file(imageObject), 200


app.run(debug=True)
