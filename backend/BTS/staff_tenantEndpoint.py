from flask import request
from flask_login import login_required
from flask_pymongo import ObjectId
from .utils import serverResponse, validate_required_info, check_duplicate, find_and_return_one
from werkzeug.security import generate_password_hash
import datetime


# For the staff to edit tenant info
def change_tenant_info(app, mongo):

    def find_tenant_by_id(tenantID):
        return find_and_return_one(mongo, "tenant", "_id", tenantID)

    @app.route("/tenant", methods=["POST"])
    @login_required
    def add_tenant():
        required_info = ["name", "email", "pswd", "institutionID",
                         "stallName", "fnb", "staffID"]

        try:
            if request.method == "POST":
                tenant_info = request.json

            # validate and check duplicate email
            validated, message = validate_required_info(
                tenant_info, required_info)
            duplicate = check_duplicate(
                mongo, "tenant", "email", tenant_info["email"])

            if validated and not duplicate:
                data = {
                    "_id": str(ObjectId()),
                    "name": tenant_info["name"],
                    "stallName": tenant_info["stallName"],
                    "email": tenant_info["email"].lower(),
                    "pswd": generate_password_hash(tenant_info["pswd"]),
                    "institutionID": tenant_info["institutionID"],
                    "fnb": tenant_info["fnb"],
                    "createdBy": tenant_info["staffID"],
                    "dateCreated": datetime.datetime.now().isoformat(),
                    "tenantDateStart": tenant_info.get("tenantDateStart", None),
                    "tenantDateEnd": tenant_info.get("tenantDateEnd", None),
                    "expoToken": []
                }
                try:
                    mongo.db.tenant.insert_one(data)
                except:
                    return serverResponse(None, 404, "Cannot upload data to server")
            else:
                # send appropriate error messages
                if not validated and not duplicate:
                    return serverResponse(message, 400, "Insufficient/Error in data to add new tenant")
                elif validated and duplicate:
                    return serverResponse(None, 400, "Duplicate email found")
                else:
                    return serverResponse(message, 400, "Duplicate email and insufficient/error in data to add new tenant")
        except:
            return serverResponse(None, 404, "No response received")

        return serverResponse(None, 201, "Tenant Added")

    @app.route("/tenant", methods=["GET", "DELETE"])
    @login_required
    def edit_tenant():
        try:
            tenantID = request.args.get("tenantID", None)
            if tenantID is None:
                return serverResponse(None, 400, "Missing tenantID")

            tenant_found, tenant_info = find_tenant_by_id(tenantID)
            if tenant_found is not None:
                if not tenant_found:
                    return serverResponse(None, 404, "No matching tenant ID found")

            if request.method == "GET":
                return serverResponse(tenant_info, 200, "Success")

            elif request.method == "DELETE":
                mongo.db.tenant.delete_one({"_id": tenantID})
                # check if tenant is still there after deleting
                tenant_found, tenant_info = find_tenant_by_id(tenantID)

                if not tenant_found:
                    return serverResponse(None, 200, "Tenant with ID " + tenantID + " deleted")
                else:
                    return serverResponse(None, 400, "Error deleting the tenant")
        except:
            return serverResponse(None, 404, "Error connecting to server")
