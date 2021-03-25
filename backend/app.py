from BTS.auditsEndpoint import addAuditsEndpoint
from BTS.loginEndpoints import addLoginEndpointsForTenantAndStaff
from BTS.imagesEndpoint import addImagesEndpoint
from BTS.auditsEndpoint_wx import addWenXinEndpoints
from BTS.recentAuditsEndpoints import addRecentAuditsEndpoints
from BTS.utils import successMsg, successResponse
from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
import os


app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv("MONGODB_URI")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
mongo = PyMongo(app)

WEB_APP_URI = os.getenv("WEB_APP_URI")
CORS(app, supports_credentials=True, resources={r"/*": {"origins": [
     "http://localhost:19006", WEB_APP_URI]}})


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

port = int(os.getenv('PORT', 5000))
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port)
