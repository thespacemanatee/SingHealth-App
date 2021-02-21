export const ADD_AUDIT_TENANT_SELECTION = "ADD_AUDIT_TENANT_SELECTION";
export const ADD_CHOSEN_CHECKLIST = "ADD_CHOSEN_CHECKLIST";

export const addAuditTenantSelection = (tenant) => {
  return { type: ADD_AUDIT_TENANT_SELECTION, tenant: tenant };
};

export const addChosenChecklist = (checklist) => {
  return { type: ADD_CHOSEN_CHECKLIST, checklist: checklist };
};
