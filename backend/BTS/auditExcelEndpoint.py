

from .utils import serverResponse, find_and_return_one, send_audit_email_excel
from flask_login import login_required

def validate_audit_info_excel(auditID, mongo):
    data = {}
    data["missing"] = []
    data["error"] = []

    audit_found, audit_info = find_and_return_one(
        mongo, "audits", "_id", auditID)

    if audit_found is not None:
        if audit_found:
            # get staff and tenants
            staff_found, staff_info = find_and_return_one(
                mongo, "staff", "_id", audit_info["staffID"])
            tenant_found, tenant_info = find_and_return_one(
                mongo, "tenant", "_id", audit_info["tenantID"])

            # extracting necessary info from staff and tenant
            if (staff_found is not None) and (tenant_found is not None):

                if staff_found and tenant_found:

                    # get institution
                    inst_found, inst_info = find_and_return_one(
                        mongo, "institution", "_id", staff_info["institutionID"])
                    if inst_found is not None:
                        if inst_found:
                            data = {}
                            data["audit_info"] = audit_info
                            data["staff_info"] = staff_info
                            data["tenant_info"] = tenant_info
                            data["inst_info"] = inst_info
                            return True, data
                        else:
                            data["missing"].append("institution")

                    else:
                        data["error"].append("institution")

                elif (not staff_found) and tenant_found:
                    data["missing"].append("staff")

                elif staff_found and (not tenant_found):
                    data["missing"].append("tenant")

                else:
                    data["missing"].append("staff")
                    data["missing"].append("tenant")

            elif (staff_found is None) and (tenant_found is not None):
                data["error"].append("staff")

            elif (staff_found is not None) and (tenant_found is None):
                data["error"].append("tenant")

            else:
                data["error"].append("staff")
                data["error"].append("tenant")

        else:
            data["missing"].append("audit")
    else:
        data["error"].append("audit")

    return False, data

def addAuditExcelEndpoints(app, mongo):
    @app.route("/email/excel/<auditID>", methods=["POST"])
    @login_required
    def export_excel_to_email(auditID):
        try:
            validate, data = validate_audit_info_excel(auditID)

            if validate:
                date_underscore = data["audit_info"]["date"].strftime(
                    '%Y_%m_%d')
                date_slash = data["audit_info"]["date"].strftime('%Y/%m/%d')
                stall_name = data["tenant_info"]["stallName"]

                to_email = data["staff_info"]["email"]
                subject = "Audit Data - " + \
                    stall_name + " (" + date_slash + ")"
                message = ""
                page_name = "Info"

                stall_name = stall_name.replace(" ", "_")
                stall_name = stall_name.upper()
                excel_name = "audit_" + date_underscore + "_" + stall_name

                sent = send_audit_email_excel(app, to_email, subject, message,
                                              excel_name, page_name, data)

                if sent:
                    return serverResponse(None, 200, "Audit email sent")
                else:
                    return serverResponse(None, 404, "Error in sending email")

            else:
                return serverResponse(data, 404, "Missing/Error in information")
        except:
            return serverResponse(data, 404, "Internal Error")

    