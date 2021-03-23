export const ADD_AUDIT_TENANT_SELECTION = "ADD_AUDIT_TENANT_SELECTION";
export const ADD_CHOSEN_CHECKLIST = "ADD_CHOSEN_CHECKLIST";
export const ADD_COVID_CHECKLIST = "ADD_COVID_CHECKLIST";
export const ADD_SAVED_CHECKLIST = "ADD_SAVED_CHECKLIST";
export const ADD_IMAGE = "ADD_IMAGE";
export const DELETE_IMAGE = "DELETE_IMAGE";
export const ADD_REMARKS = "ADD_REMARKS";
export const SET_MAXIMUM_SCORE = "SET_MAXIMUM_SCORE";
export const CHANGE_CURRENT_SCORE = "CHANGE_CURRENT_SCORE";
export const CHANGE_MAXIMUM_SCORE = "CHANGE_MAXIMUM_SCORE";
export const CHANGE_ANSWER = "CHANGE_ANSWER";
export const CHANGE_DEADLINE = "CHANGE_DEADLINE";

export const TYPE_FNB = "fnb";
export const TYPE_NON_FNB = "non_fnb";
export const TYPE_COVID = "covid19";

export const addAuditTenantSelection = (tenant) => {
  return { type: ADD_AUDIT_TENANT_SELECTION, tenant };
};
export const addChosenChecklist = (checklistType, checklist) => {
  return {
    type: ADD_CHOSEN_CHECKLIST,
    checklist_type: checklistType,
    checklist,
  };
};
export const addCovidChecklist = (checklist) => {
  return {
    type: ADD_COVID_CHECKLIST,
    checklist,
  };
};
export const addSavedChecklist = (data) => {
  return {
    type: ADD_SAVED_CHECKLIST,
    data,
  };
};

export const addImage = (section, index, imageUri) => {
  return {
    type: ADD_IMAGE,
    section,
    index,
    imageUri,
  };
};
export const deleteImage = (section, index, selectedIndex) => {
  return {
    type: DELETE_IMAGE,
    section,
    index,
    selectedIndex,
  };
};
export const addRemarks = (section, index, remarks) => {
  return {
    type: ADD_REMARKS,
    section,
    index,
    remarks,
  };
};
export const changeAnswer = (section, index, deleted, checked) => {
  return {
    type: CHANGE_ANSWER,
    section,
    index,
    deleted,
    checked,
  };
};
export const changeDeadline = (section, index, date) => {
  return {
    type: CHANGE_DEADLINE,
    section,
    index,
    date,
  };
};
