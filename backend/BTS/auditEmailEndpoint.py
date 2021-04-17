# -*- coding: utf-8 -*-

from flask_login import login_required
from .utils import serverResponse, find_and_return_one, send_audit_email_excel, send_audit_email_word


def check_valid_param(data):
    if(len(data["missing"]) > 0) or (len(data["error"]) > 0):
        return False
    else:
        return True

def map_qna(question_dict, ans_dict):
    form_with_ans = {}
    summary_table = []
    summary_form = {}
    total_points = 0
    
    for checklist_name in question_dict.keys():        
        form_with_ans[checklist_name] = []
        
        points = 0
        max_points = 0
        for i in range(len(question_dict[checklist_name])): 
            question = question_dict[checklist_name][i]['question']
            answer_bool = ans_dict[checklist_name][i]['answer']
            item = ans_dict[checklist_name][i]
            
            if answer_bool is None:
                pass
                
            elif answer_bool:
                form_with_ans[checklist_name].append({
                    "question": question,
                    "answer": True})
                points += 1
                max_points += 1
                
            else:
                form_with_ans[checklist_name].append({
                    "question": question,
                    "answer": False,
                    "items": item})
                max_points += 1
                
        summary_table.append({
            "section": checklist_name,
            "points": points,
            "max_points": max_points
            })
        total_points += max_points
    
    summary_form["total"] = total_points
    summary_form["table"] = summary_table
    
    return form_with_ans, summary_form

def validate_and_pack_audit_info_word(auditID, mongo):
    data = {}
    data["missing"] = []
    data["error"] = []

    audit_found, audit_info = find_and_return_one(
        mongo, "audits", "_id", auditID)

    # check audit
    if audit_found is None:
        data["error"].append("audit")
    elif not(audit_found):
        data["missing"].append("audit")

    if not(check_valid_param(data)):
        return False, False

    # get staff and tenants
    staff_found, staff_info = find_and_return_one(
        mongo, "staff", "_id", audit_info["staffID"])
    tenant_found, tenant_info = find_and_return_one(
        mongo, "tenant", "_id", audit_info["tenantID"])
    if staff_found is None:
        data["error"].append("staff")
    elif not(staff_found):
        data["missing"].append("staff")

    if tenant_found is None:
        data["error"].append("tenant")
    elif not(tenant_found):
        data["missing"].append("tenant")

    if not(check_valid_param(data)):
        return False, False

    # get inst
    inst_found, inst_info = find_and_return_one(
        mongo, "institution", "_id", staff_info["institutionID"])
    if inst_found is None:
        data["error"].append("institution")
    elif not(inst_found):
        data["missing"].append("institution")

    if not(check_valid_param(data)):
        return False, False

    # get all form
    audit_form = {}
    audit_form["auditQues"] = {}

    for checklist_type in audit_info["auditChecklists"]:
        form_found, form_info = find_and_return_one(
            mongo, "auditFormTemplate", "type", checklist_type)

        if form_found is None:
            data["error"].append(checklist_type + " Form")

        elif not(form_found):
            data["missing"].append(checklist_type + " Form")

        else:
            audit_form["auditQues"][checklist_type] = form_info["questions"]

    # get all ans
    audit_form["auditAns"] = {}

    for checklist_type in audit_info["auditChecklists"]:
        auditFormID = audit_info["auditChecklists"][checklist_type]
        ans_found, ans_info = find_and_return_one(
            mongo, "filledAuditForms", "_id", auditFormID)
        if ans_found is None:
            data["error"].append(checklist_type + " Answer")

        elif not(ans_found):
            data["missing"].append(checklist_type + " Answer")

        else:
            audit_form["auditAns"][checklist_type] = ans_info["answers"]

    if not(check_valid_param(data)):
        return False, False

    # try to map question and ans
    audit_info["form_with_ans"] = {}
    for form in audit_form["auditQues"]:
        if form == "non_fnb":
            color = "ceeffc"
            form_name = "Non-F&B"

        elif form == "fnb":
            color = "bbeebb"
            form_name = "F&B"

        elif form == "covid19":
            color = "f786a0"
            form_name = "Covid-19"
        
        #map info
        question_dict = audit_form["auditQues"][form]
        ans_dict = audit_form["auditAns"][form]
        form_with_ans, summary_form = map_qna(question_dict, ans_dict)
        
        audit_info["form_with_ans"][form] = {
            "type" : form_name,
            "color" : color,
            "form_with_ans": form_with_ans,
            "summary_form": summary_form
            }
         
    data = {}
    data["audit_info"] = audit_info
    data["staff_info"] = staff_info
    data["tenant_info"] = tenant_info
    data["inst_info"] = inst_info

    return True, data   


def addAuditEmailEndpoints(app, mongo):
    def validate_audit_info_excel(auditID):
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

    @app.route("/email/word/<auditID>", methods=["POST"])
    @login_required
    def export_word_to_email(auditID):
        try:
            validate, data = validate_and_pack_audit_info_word(auditID)

            if validate:
                date_underscore = data["audit_info"]["date"].strftime(
                    '%Y_%m_%d')
                date_slash = data["audit_info"]["date"].strftime('%Y/%m/%d')
                stall_name = data["tenant_info"]["stallName"]

                to_email = data["staff_info"]["email"]

                subject = "Audit Data - " + \
                    stall_name + " (" + date_slash + ")"
                message = ""

                stall_name = stall_name.replace(" ", "_")
                stall_name = stall_name.upper()
                word_name = "audit_" + date_underscore + "_" + stall_name

                sent = send_audit_email_word(app, to_email, subject, message,
                                             word_name, data)

                if sent:
                    return serverResponse(None, 200, "Audit email sent")
                else:
                    return serverResponse(None, 404, "Error in sending email")

            else:
                return serverResponse(data, 404, "Missing/Error in information")
        except:
            return serverResponse(data, 404, "Internal Error")
