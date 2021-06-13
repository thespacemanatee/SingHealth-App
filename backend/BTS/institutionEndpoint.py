# -*- coding: utf-8 -*-

from flask_login import login_required
from .utils import serverResponse


def institution_info(app, mongo):
    @app.route("/institutions", methods=["GET"])
    # @login_required
    def get_institution_data(): 
        try:
            insts = mongo.db.institution.find()

            output = serverResponse(insts, 200, "Success")
        except:
            output = serverResponse(None, 404, "Error in connection")

        return output
