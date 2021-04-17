from gevent import monkey; monkey.patch_all()
from os.path import dirname
from dotenv import load_dotenv
import os

from flask_login import LoginManager
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
from BTS.constants import CORS_LOCALHOST

from dotenv import load_dotenv
from os.path import dirname, join
import os



def create_app():
    
    app = Flask(__name__)
    load_dotenv(dirname(__file__), '.env')
    app.config.from_pyfile(join('BTS','config.py'))
    

    login_manager = LoginManager()
    login_manager.session_protection = None
    login_manager.init_app(app)

    mongo.init_app(app)

    WEB_APP_URI = os.getenv("WEB_APP_URI")

    CORS(
        app, 
        supports_credentials=True, 
        resources={
            r"/*": {
                "origins": [
                    CORS_LOCALHOST, 
                    WEB_APP_URI
                    ]
                }
            }
        )


    addGetFormEndpoints(app, mongo)
    addAuditsEndpoint(app, mongo)
    addRectificationEndpts(app, mongo)
    addImagesEndpoint(app)
    addLoginEndpointsForTenantAndStaff(app, mongo, login_manager)
    addRecentAuditsEndpoints(app, mongo)
    addAuditEmailEndpoints(app, mongo)
    institution_info(app, mongo)
    change_tenant_info(app, mongo)
    audit_timeframe_endpoint(app, mongo)

    


    @app.route('/', methods=["GET", "POST"])
    def hello_world():
        return serverResponse(None, 200, "Yes this endpoint is working")
    
    return app


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app = create_app()
    app.run(host='0.0.0.0', port=port, load_dotenv=".env")
