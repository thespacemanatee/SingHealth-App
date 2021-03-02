export const ADD_AUDIT_TENANT_SELECTION = "ADD_AUDIT_TENANT_SELECTION";
export const ADD_CHOSEN_CHECKLIST = "ADD_CHOSEN_CHECKLIST";
export const ADD_IMAGE = "ADD_IMAGE";
export const ADD_REMARKS = "ADD_REMARKS";
export const SET_MAXIMUM_SCORE = "SET_MAXIMUM_SCORE";
export const CHANGE_CURRENT_SCORE = "CHANGE_CURRENT_SCORE";
export const CHANGE_MAXIMUM_SCORE = "CHANGE_MAXIMUM_SCORE";

export const addAuditTenantSelection = (tenant) => {
  return { type: ADD_AUDIT_TENANT_SELECTION, tenant: tenant };
};

export const addChosenChecklist = (checklist_type, checklist) => {
  return {
    type: ADD_CHOSEN_CHECKLIST,
    checklist_type: checklist_type,
    checklist: checklist,
  };
};

export const addImage = (index, imageUri) => {
  return { type: ADD_IMAGE, index: index, imageUri: imageUri };
};

export const addRemarks = (index, remarks) => {
  return { type: ADD_REMARKS, index: index, remarks: remarks };
};

export const setMaximumScore = (score) => {
  return { type: SET_MAXIMUM_SCORE, score: score };
};

export const changeCurrentScore = (change) => {
  return { type: CHANGE_CURRENT_SCORE, change: change };
};

export const changeMaximumScore = (change) => {
  return { type: CHANGE_MAXIMUM_SCORE, change: change };
};
