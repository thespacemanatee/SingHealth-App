import sys
sys.path.append("..\\")

from flask import Flask
from flask_testing import TestCase
from BTS.auditsEndpoint import addAuditsEndpoint
from BTS.loginEndpoints import addLoginEndpointsForTenantAndStaff
from BTS.imagesEndpoint import addImagesEndpoint
from BTS.rectificationEndpoints import addRectificationEndpts
from BTS.auditsEndpoint_wx import addWenXinEndpoints
from BTS.staff_tenantEndpoint_wx import change_tenant_info
from BTS.recentAuditsEndpoints import addRecentAuditsEndpoints
from BTS.auditEmailEndpoint import addAuditEmailEndpoints
from BTS.institutionEndpoint import institution_info
from BTS.login import User
from BTS.utils import serverResponse

import BTS.database
from dotenv import load_dotenv

import mongomock
from unittest.mock import patch
import unittest
import os
from os.path import join, dirname

class BTSAppTestCase(TestCase):
    @patch.object(BTS.database,"mongo", side_effect=mongomock.MongoClient)
    def create_app(self, mockMongo):

        app = Flask(__name__)
        app.config['TESTING'] = True
        app.config["FLASK_ENV"] = "development"
        app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
        app.config['LOGIN_DISABLED'] = True
        app.add_url_rule(
            "/",
            methods=["GET", "POST"], 
            view_func = \
                lambda  : serverResponse(
                    None, 
                    200, 
                    """Yes this endpoint is working."""
                    )
            )
        self.mongo = mockMongo
        addImagesEndpoint(app)
        institution_info(app, mockMongo)
        addAuditsEndpoint(app, mockMongo)
        addRectificationEndpts(app, mockMongo)
        addLoginEndpointsForTenantAndStaff(app, mockMongo)
        addWenXinEndpoints(app, mockMongo)
        addRecentAuditsEndpoints(app, mockMongo)
        addAuditEmailEndpoints(app, mockMongo)
        change_tenant_info(app, mockMongo)
        return app