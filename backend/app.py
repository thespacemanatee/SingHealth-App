from BTS.auditsEndpoint import processAuditdata, validateFilledAuditForms
from BTS.loginEndpoints import setUpLoginEndpointsForTenantAndStaff
from BTS.utils import successMsg, failureMsg, upload_image, download_image
from BTS.constants import S3BUCKETNAME, MONGODB_URI
from pymongo.errors import DuplicateKeyError
from flask import Flask, request, send_file
from flask_pymongo import PyMongo
from flask_login import login_required
from flask_cors import CORS
from base64 import b64decode
import secrets
import io


app = Flask(__name__)
app.config["MONGO_URI"] = MONGODB_URI
app.config["SECRET_KEY"] = secrets.token_urlsafe(nbytes=32)
mongo = PyMongo(app)
CORS(app)


@app.route('/')
def hello_world():
    return 'Hello, good World!'

@app.route("/audits", methods=['POST'])
@login_required
def audits():
    if request.method == 'POST':
        auditData = request.json
        filledAuditForms , auditMetaData = processAuditdata(auditData)
        allFormsAreValid = validateFilledAuditForms(filledAuditForms)
        
        if not allFormsAreValid[0]:
            return failureMsg(allFormsAreValid[1], 400), 400
            
        try:
            mongo.db.audits.insert_one(auditMetaData)
            for filledForm in filledAuditForms.values():
                mongo.db.filledAuditForms.insert_one(filledForm)
        except DuplicateKeyError:
            return failureMsg("Form has already been uploaded", 400), 400

        return successMsg("Forms have been submitted"), 200


#TODO: Add defence against duplicate file names
@app.route("/images", methods=["GET", 'POST'])
@login_required
def images():
    if request.method == 'POST':
        if len(request.files) > 0:
            formdata = request.files
            images = formdata.getlist("images")

            for image in images:
                imgName = image.filename
                upload_image(image, S3BUCKETNAME, imgName)

            return successMsg("Pictures have successfully been uploaded"), 200

        requestData = request.json
        if len(requestData["images"]) > 0:
            for image in requestData["images"]:
                imageName = image["fileName"]
                imageData = image["uri"]
                imageBytes = io.BytesIO(b64decode(imageData))
                upload_image(imageBytes, S3BUCKETNAME, imageName)
            return successMsg("Pictures have successfully been uploaded"), 200
        
        return failureMsg("No image data received", 400), 400


    elif request.method == "GET":
        details = request.json
        filename = details["image"]
        filetype = str(filename.split('.')[-1])
        imageObject = download_image(filename, S3BUCKETNAME)
        return send_file(imageObject), 200



setUpLoginEndpointsForTenantAndStaff(app, mongo)
app.run(debug=True)
