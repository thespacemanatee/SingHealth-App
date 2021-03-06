import sys
sys.path.append("..\\")

from flask import Flask
from flask_testing import TestCase
from BTS.auditsEndpoint import addAuditsEndpoint
from BTS.loginEndpoints import addLoginEndpointsForTenantAndStaff
from BTS.imagesEndpoint import addImagesEndpoint
from BTS.rectificationEndpoints import addRectificationEndpts
from BTS.staff_tenantEndpoint import change_tenant_info
from BTS.auditsGetFormEndpoint import addGetFormEndpoints
from BTS.recentAuditsEndpoints import addRecentAuditsEndpoints
from BTS.auditEmailEndpoint import addAuditEmailEndpoints, validate_and_pack_audit_info_word
from BTS.institutionEndpoint import institution_info
from BTS.utils import serverResponse
import unittest

import BTS.database

import mongomock
from unittest.mock import patch, Mock
import os

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
        institution_info(app, self.mongo)
        addAuditsEndpoint(app, self.mongo)
        addRectificationEndpts(app, self.mongo)
        addLoginEndpointsForTenantAndStaff(app, self.mongo, Mock())
        addGetFormEndpoints(app, self.mongo)
        addRecentAuditsEndpoints(app, self.mongo)
        addAuditEmailEndpoints(app, self.mongo)
        change_tenant_info(app, self.mongo)
        
        return app


