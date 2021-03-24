from BTS.auditsEndpoint import addAuditsEndpoint
from BTS.loginEndpoints import addLoginEndpointsForTenantAndStaff
from BTS.imagesEndpoint import addImagesEndpoint
from BTS.auditsEndpoint_wx import addWenXinEndpoints
from BTS.recentAuditsEndpoints import addRecentAuditsEndpoints
from BTS.constants import CLOUD_MONGODB_URI, LOCAL_MONGODB_URI
from BTS.utils import successMsg, successResponse
from flask import Flask, request
from flask_pymongo import PyMongo
from flask_cors import CORS
import secrets


app = Flask(__name__)
app.config["MONGO_URI"] = CLOUD_MONGODB_URI
app.config["SECRET_KEY"] = secrets.token_urlsafe(nbytes=32)
mongo = PyMongo(app)
CORS(app, supports_credentials=True)


@ app.route('/', methods=["GET", "POST"])
def hello_world0():
    return successResponse(successMsg("""Yes this endpoint is working
        Remember to disable any @login_required decorators before testing that endpoint"""))


@ app.route('/<num>', methods=["GET", "POST"])
def hello_world1(num):
    return successResponse(successMsg(f"Yes. Num endpoint received: {num}"))


@ app.route('/<num>/suffix', methods=["GET", "POST"])
def hello_world2(num):
    return successResponse(successMsg(f"Yes. Num suffix endpoint received: {num}"))


@app.route('/<int:year>/<int:month>/<title>')
def article(year, month, title):
    return successResponse(successMsg(f"Yes. Num endpoint received: {year}, {month}, {title}"))


addWenXinEndpoints(app, mongo)
addAuditsEndpoint(app, mongo)
addImagesEndpoint(app)
addLoginEndpointsForTenantAndStaff(app, mongo)
addRecentAuditsEndpoints(app, mongo)

port = int(os.environ.get('PORT', 5000))
app.run(host='0.0.0.0', port=port)
