# -*- coding: utf-8 -*-

from flask_login import login_required
from .utils import serverResponse, find_and_return_one, send_audit_email_excel, send_audit_email_word

def addAuditEmailEndpoints(app, mongo):
    def validate_audit_info_excel(auditID):
        data = {}
        data["missing"] = []
        data["error"] = []
        
        audit_found, audit_info = find_and_return_one(mongo, "audits", "_id", auditID)
        
        if audit_found is not None:
            if audit_found:          
                #get staff and tenants
                staff_found, staff_info = find_and_return_one(mongo, "staff", "_id", audit_info["staffID"])
                tenant_found, tenant_info = find_and_return_one(mongo, "tenant", "_id", audit_info["tenantID"])
    
                #extracting necessary info from staff and tenant
                if (staff_found is not None) and (tenant_found is not None):
                    
                    if staff_found and tenant_found:
                        
                        #get institution 
                        inst_found, inst_info = find_and_return_one(mongo, "institution", "_id", staff_info["institutionID"])
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
                date_underscore = data["audit_info"]["date"].strftime('%Y_%m_%d')
                date_slash = data["audit_info"]["date"].strftime('%Y/%m/%d')
                stall_name = data["tenant_info"]["stallName"]
                
                
                to_email = data["staff_info"]["email"]
                subject = "Audit Data - " + stall_name + " (" + date_slash + ")"
                message= ""
                page_name = "Info"
                
                stall_name = stall_name.replace(" ", "_")
                stall_name = stall_name.upper()
                excel_name = "audit_"+ date_underscore + "_" + stall_name
        
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
        
    #FOR WORD DOCS
    def check_valid_param(data):
        if(len(data["missing"])> 0) or (len(data["error"])> 0):
            return False
        else:
            return True
    
    def map_qna(question_dict, ans_dict):
        for checklist_name in question_dict["questions"].keys():
            for i in range(len(question_dict["questions"][checklist_name])):
                question_dict["questions"][checklist_name][i]["answer"] = ans_dict["answers"][checklist_name][i]["answer"]
        
        return question_dict
    
    def validate_and_pack_audit_info_word(auditID):
        data = {}
        data["missing"] = []
        data["error"] = []
        
        audit_found, audit_info = find_and_return_one(mongo, "audits", "_id", auditID)
        
        #check audit
        if audit_found is None:
            data["error"].append("audit")
        elif not(audit_found):
            data["missing"].append("audit")
        
        if not(check_valid_param(data)):
            return False, False
        
                 
        #get staff and tenants
        staff_found, staff_info = find_and_return_one(mongo, "staff", "_id", audit_info["staffID"])
        tenant_found, tenant_info = find_and_return_one(mongo, "tenant", "_id", audit_info["tenantID"])
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
    
        #get inst
        inst_found, inst_info = find_and_return_one(mongo, "institution", "_id", staff_info["institutionID"])
        if inst_found is None:
            data["error"].append("institution")
        elif not(inst_found):
            data["missing"].append("institution")
        
        if not(check_valid_param(data)):
            return False, False

        #get all form
        audit_info["auditForm"] = {}
                        
        for checklist_type in audit_info["auditChecklists"]:
            form_found, form_info = find_and_return_one(mongo, "auditFormTemplate", "type", checklist_type)
            
            if form_found is None:
                data["error"].append(checklist_type + " Form")
            
            elif not(form_found):
                data["missing"].append(checklist_type+ " Form")
            
            else:
                audit_info["auditForm"][checklist_type] = form_info
        
        #get all ans
        audit_info["auditAns"] = {}
        
        for checklist_type in audit_info["auditChecklists"]:
            auditFormID = audit_info["auditChecklists"][checklist_type]
            ans_found, ans_info = find_and_return_one(mongo, "filledAuditForms", "_id", auditFormID)
            if ans_found is None:
                data["error"].append(checklist_type + " Answer")
            
            elif not(ans_found):
                data["missing"].append(checklist_type + " Answer")
            
            else:
                audit_info["auditAns"][checklist_type] = ans_info
                        
        if not(check_valid_param(data)):
            return False, False
        
        
        #try to map question and ans
        for form in audit_info["auditForm"]:
            question_dict = audit_info["auditForm"][form]
            ans_dict = audit_info["auditAns"][form]
            question_dict = map_qna(question_dict, ans_dict)
        
        #map the value 
        for form_type in audit_info["auditForm"].keys():
            if form_type == "non_fnb":
                color = "ceeffc"
                form_name = "Non-F&B"
                
            elif form_type == "fnb":
                color = "bbeebb"
                form_name = "F&B"
            
            elif form_type == "covid19":
                color = "f786a0"
                form_name = "Covid-19"
     
            audit_info["auditForm"][form_type]["type"] = form_name
            audit_info["auditForm"][form_type]["color"] = color
    
    
        data = {}
        data["audit_info"] = audit_info
        data["staff_info"] = staff_info
        data["tenant_info"] = tenant_info
        data["inst_info"] = inst_info
        
        return True, data
    
    @app.route("/email/word/<auditID>", methods=["POST"])
    @login_required
    def export_word_to_email(auditID):
        try:
            validate, data = validate_and_pack_audit_info_word(auditID)
            
            if validate:  
                date_underscore = data["audit_info"]["date"].strftime('%Y_%m_%d')
                date_slash = data["audit_info"]["date"].strftime('%Y/%m/%d')
                stall_name = data["tenant_info"]["stallName"]
                
                
                to_email = data["staff_info"]["email"]
                
                subject = "Audit Data - " + stall_name + " (" + date_slash + ")"
                message= ""
                
                stall_name = stall_name.replace(" ", "_")
                stall_name = stall_name.upper()
                word_name = "audit_"+ date_underscore + "_" + stall_name
                
                
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