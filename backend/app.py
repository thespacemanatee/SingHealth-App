from gevent import monkey; monkey.patch_all()
from BTS.auditsEndpoint import addAuditsEndpoint
from BTS.loginEndpoints import addLoginEndpointsForTenantAndStaff
from BTS.imagesEndpoint import addImagesEndpoint
from BTS.auditsGetFormEndpoint import addGetFormEndpoints
from BTS.staff_tenantEndpoint import change_tenant_info
from BTS.recentAuditsEndpoints import addRecentAuditsEndpoints
from BTS.auditEmailEndpoint import addAuditEmailEndpoints
from BTS.institutionEndpoint import institution_info
from BTS.utils import serverResponse
from flask import Flask
from BTS.database import mongo

from flask_cors import CORS
import os
from dotenv import load_dotenv
from os.path import join, dirname

load_dotenv(dirname(__file__), '.env')

app = Flask(__name__)
app.config["FLASK_ENV"] = "development"
app.config["MONGO_URI"] = os.getenv("MONGODB_URI")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
# app.config["SESSION_COOKIE_DOMAIN"] = "singhealth-backend-bts.herokuapp.com"
mongo.init_app(app)

WEB_APP_URI = os.getenv("WEB_APP_URI")
CORS(app, supports_credentials=True, resources={r"/*": {"origins": [
     "http://localhost:19006", WEB_APP_URI]}})


@ app.route('/', methods=["GET", "POST"])
def hello_world0():
    return serverResponse(None, 200, """Yes this endpoint is working""")


# @ app.route('/<num>', methods=["GET", "POST"])
# def hello_world1(num):
#     return serverResponse(None, 200, f"Yes. Num endpoint received: {num}")


# @ app.route('/<num>/suffix', methods=["GET", "POST"])
# def hello_world2(num):
#     return serverResponse(None, 200, f"Yes. Num suffix endpoint received: {num}")


# @app.route('/<int:year>/<int:month>/<title>')
# def article(year, month, title):
#     return serverResponse(None, 200, f"Yes. Num endpoint received: {year}, {month}, {title}")


addGetFormEndpoints(app, mongo)
addAuditsEndpoint(app, mongo)
addImagesEndpoint(app)
addLoginEndpointsForTenantAndStaff(app, mongo)
addRecentAuditsEndpoints(app, mongo)
addAuditEmailEndpoints(app, mongo)
institution_info(app, mongo)
change_tenant_info(app, mongo)

port = int(os.getenv('PORT', 5000))
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, debug=True, load_dotenv=".env")
