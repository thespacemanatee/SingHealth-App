import { endpoint, httpClient } from "../../helpers/CustomHTTPClient";

export const ADD_AUDIT_TENANT_SELECTION = "ADD_AUDIT_TENANT_SELECTION";
export const ADD_CHOSEN_CHECKLIST = "ADD_CHOSEN_CHECKLIST";
export const ADD_COVID_CHECKLIST = "ADD_COVID_CHECKLIST";
export const CREATE_AUDIT_METADATA = "CREATE_AUDIT_METADATA";
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
// export const RECTIFY_CHOSEN_CHECKLIST = "RECTIFY_CHOSEN_CHECKLIST";
// export const RECTIFY_COVID_CHECKLIST = "RECTIFY_COVID_CHECKLIST";

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
export const addChosenChecklist = (fnb = true) => {
  return async (dispatch) => {
    const checklistType = fnb ? "fnb" : "non_fnb";
    const options = {
      url: `${endpoint}auditForms/${checklistType}`,
      method: "get",
      // withCredentials: true,
    };

    const res = await httpClient(options);

    const checklist = res.data;
    // console.log(`Done fetching ${checklistType} checklist`, checklist);
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
    // console.log("Done fetching covid checklist", checklist);
    return dispatch({ type: ADD_COVID_CHECKLIST, checklist });
  };
};

export const createAuditMetadata = (auditMetadata) => {
  return { type: CREATE_AUDIT_METADATA, auditMetadata };
};

export const addSavedChecklist = (data) => {
  return {
    type: ADD_SAVED_CHECKLIST,
    data,
  };
};

export const addImage = (
  checklistType,
  section,
  index,
  fileName,
  imageUri,
  rectify = false
) => {
  return {
    type: ADD_IMAGE,
    checklistType,
    section,
    index,
    fileName,
    imageUri,
    rectify,
  };
};
export const deleteImage = (checklistType, section, index, selectedIndex) => {
  return {
    checklistType,
    type: DELETE_IMAGE,
    section,
    index,
    selectedIndex,
  };
};
export const addRemarks = (
  checklistType,
  section,
  index,
  remarks,
  rectify = false
) => {
  return {
    checklistType,
    type: ADD_REMARKS,
    section,
    index,
    remarks,
    rectify,
  };
};
export const changeAnswer = (
  checklistType,
  section,
  index,
  deleted,
  checked
) => {
  return {
    type: CHANGE_ANSWER,
    checklistType,
    section,
    index,
    deleted,
    checked,
  };
};
export const changeDeadline = (checklistType, section, index, date) => {
  return {
    type: CHANGE_DEADLINE,
    checklistType,
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

export const submitRectification = (auditID, data) => {
  return async () => {
    console.log("DATA", data);
    const options = {
      url: `${endpoint}audits/${auditID}/tenant`,
      method: "patch",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data,
    };

    const res = await httpClient(options);

    return res;
  };
};

// export const rectifyChosenChecklist = (data) => {
//   return { type: RECTIFY_CHOSEN_CHECKLIST, data };
// };

// export const rectifyCovidChecklist = (data) => {
//   return { type: RECTIFY_COVID_CHECKLIST, data };
// };
