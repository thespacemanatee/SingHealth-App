import { endpoint, httpClient } from "../../helpers/CustomHTTPClient";

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
export const RESET_CHECKLIST_STORE = "RESET_CHECKLIST_STORE";
export const GET_AUDIT_DATA = "GET_AUDIT_DATA";
export const GET_IMAGE = "GET_IMAGE";

export const TYPE_FNB = "fnb";
export const TYPE_NON_FNB = "non_fnb";
export const TYPE_COVID = "covid19";

export const getChecklist = (checklistType, tenant) => async (dispatch) => {
  console.log(checklistType);

  await Promise.all([
    dispatch(addChosenChecklist(checklistType)),
    dispatch(addCovidChecklist()),
    dispatch(addAuditTenantSelection(tenant)),
  ]);
};

export const addAuditTenantSelection = (tenant) => {
  return { type: ADD_AUDIT_TENANT_SELECTION, tenant };
};
export const addChosenChecklist = (checklistType = "fnb") => {
  return async (dispatch) => {
    const options = {
      url: `${endpoint}auditForms/${checklistType}`,
      method: "get",
      // withCredentials: true,
    };

    const res = await httpClient(options);

    const checklist = res.data;
    console.log(`Done fetching ${checklistType} checklist`);
    return dispatch({ type: ADD_CHOSEN_CHECKLIST, checklistType, checklist });
  };
};

export const addCovidChecklist = () => {
  return async (dispatch) => {
    const options = {
      url: `${endpoint}auditForms/covid19`,
      method: "get",
      // withCredentials: true,
    };

    const res = await httpClient(options);

    const checklist = res.data;
    console.log("Done fetching covid checklist");
    return dispatch({ type: ADD_COVID_CHECKLIST, checklist });
  };
};

export const addSavedChecklist = (data) => {
  return {
    type: ADD_SAVED_CHECKLIST,
    data,
  };
};

export const addImage = (section, index, fileName, imageUri) => {
  return {
    type: ADD_IMAGE,
    section,
    index,
    fileName,
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
export const resetChecklistStore = () => {
  return { type: RESET_CHECKLIST_STORE };
};

export const getAuditData = (auditID, stallName) => {
  return async (dispatch) => {
    const options = {
      url: `${endpoint}audits/${auditID}`,
      method: "get",
      // withCredentials: true,
    };
    const res = await httpClient(options);
    const { data } = res;
    const { auditMetadata } = data;
    const { auditForms } = data;
    const formKeys = Object.keys(auditForms);
    const type = formKeys.find((e) => {
      return e !== "covid19";
    });
    console.log(stallName);

    dispatch({
      type: GET_AUDIT_DATA,
      chosen_tenant: { stallName, tenantID: auditMetadata.tenantID },
      chosen_checklist_type: type,
      chosen_checklist: auditForms[type],
      covid19: auditForms.covid19,
      auditMetadata,
    });
    return res;
  };
};

export const getImage = (fileName) => {
  return async () => {
    console.log(fileName);
    const options = {
      url: `${endpoint}images`,
      method: "get",
      params: {
        fileName,
      },
    };

    const res = await httpClient(options);

    return res;
  };
};
