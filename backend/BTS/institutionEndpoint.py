# -*- coding: utf-8 -*-

from flask_login import login_required
from .utils import serverResponse


def institution_info(app, mongo):
    @app.route("/institutions", methods=["GET"])
    # @login_required
    def get_institution_data(): 
        try:
            insts = mongo.db.institution.find()

            result = [{
                'institutionID': str(inst['_id']),
                'institutionName': inst["name"]
            }
                for inst in insts]

            if len(result) > 0:
                output = serverResponse(result, 200, "Success")
            else:
                output = serverResponse(None, 200, "No institution found")
        except:
            output = serverResponse(None, 404, "Error in connection")

        return output
