from gevent import monkey; monkey.patch_all()
from os.path import dirname
from dotenv import load_dotenv
import os
from flask_cors import CORS
from BTS.database import mongo
from flask import Flask
from BTS.utils import serverResponse
from BTS.auditTimeframeEndpoint import audit_timeframe_endpoint
from BTS.institutionEndpoint import institution_info
from BTS.auditEmailEndpoint import addAuditEmailEndpoints
from BTS.recentAuditsEndpoints import addRecentAuditsEndpoints
from BTS.staff_tenantEndpoint import change_tenant_info
from BTS.auditsGetFormEndpoint import addGetFormEndpoints
from BTS.imagesEndpoint import addImagesEndpoint
from BTS.loginEndpoints import addLoginEndpointsForTenantAndStaff
from BTS.rectificationEndpoints import addRectificationEndpts
from BTS.auditsEndpoint import addAuditsEndpoint


load_dotenv(dirname(__file__), '.env')

app = Flask(__name__)
app.config["FLASK_ENV"] = "development"
app.config["MONGO_URI"] = os.getenv("MONGODB_URI")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
mongo.init_app(app)

WEB_APP_URI = os.getenv("WEB_APP_URI")
CORS(app, supports_credentials=True, resources={r"/*": {"origins": [
     "http://localhost:19006", WEB_APP_URI]}})


@ app.route('/', methods=["GET", "POST"])
def hello_world0():
    return serverResponse(None, 200, """Yes this endpoint is working""")

addGetFormEndpoints(app, mongo)
addAuditsEndpoint(app, mongo)
addRectificationEndpts(app, mongo)
addImagesEndpoint(app)
addLoginEndpointsForTenantAndStaff(app, mongo)
addRecentAuditsEndpoints(app, mongo)
addAuditEmailEndpoints(app, mongo)
institution_info(app, mongo)
change_tenant_info(app, mongo)
audit_timeframe_endpoint(app, mongo)

port = int(os.getenv('PORT', 5000))
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, load_dotenv=".env")
