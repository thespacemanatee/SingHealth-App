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
export const CHANGE_RECTIFY = "CHANGE_RECTIFY";
export const TYPE_FNB = "fnb";
export const TYPE_NON_FNB = "non_fnb";
export const TYPE_COVID = "covid19";

export const getChecklist = (checklistType, tenant) => async (dispatch) => {
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
      url: `${endpoint}auditForms`,
      method: "get",
      params: { formType: checklistType },
    };

    const res = await httpClient(options);

    const checklist = res.data.data;

    return dispatch({ type: ADD_CHOSEN_CHECKLIST, checklistType, checklist });
  };
};

export const addCovidChecklist = () => {
  return async (dispatch) => {
    const options = {
      url: `${endpoint}auditForms`,
      method: "get",
      params: { formType: "covid19" },
    };

    const res = await httpClient(options);

    const checklist = res.data.data;

    return dispatch({ type: ADD_COVID_CHECKLIST, checklist });
  };
};

export const createAuditMetadata = (auditMetadata) => ({
  type: CREATE_AUDIT_METADATA,
  auditMetadata,
});

export const addSavedChecklist = (data) => ({
  type: ADD_SAVED_CHECKLIST,
  data,
});

export const addImage = (
  checklistType,
  section,
  index,
  fileName,
  imageUri,
  rectify = false
) => ({
  type: ADD_IMAGE,
  checklistType,
  section,
  index,
  fileName,
  imageUri,
  rectify,
});

export const deleteImage = (
  checklistType,
  section,
  index,
  selectedIndex,
  rectify = false
) => ({
  checklistType,
  type: DELETE_IMAGE,
  section,
  index,
  selectedIndex,
  rectify,
});

export const addRemarks = (
  checklistType,
  section,
  index,
  remarks,
  rectify = false
) => ({
  checklistType,
  type: ADD_REMARKS,
  section,
  index,
  remarks,
  rectify,
});

export const changeAnswer = (
  checklistType,
  section,
  index,
  deleted,
  checked
) => ({ type: CHANGE_ANSWER, checklistType, section, index, deleted, checked });

export const changeDeadline = (checklistType, section, index, date) => ({
  type: CHANGE_DEADLINE,
  checklistType,
  section,
  index,
  date,
});

export const resetChecklistStore = () => ({ type: RESET_CHECKLIST_STORE });

export const getAuditData = (auditID) => {
  return async (dispatch) => {
    const options = {
      url: `${endpoint}audits/${auditID}`,
      method: "get",
    };
    const res = await httpClient(options);
    const { auditMetadata, auditForms } = res.data.data;

    const formKeys = Object.keys(auditForms);
    const type = formKeys.find((e) => {
      return e !== "covid19";
    });

    dispatch({
      type: GET_AUDIT_DATA,
      chosen_tenant: {
        tenantID: auditMetadata.tenantID,
      },
      chosen_checklist_type: type,
      chosen_checklist: auditForms[type],
      covid19: auditForms.covid19,
      auditMetadata,
    });
    return res;
  };
};

export const getImage = (fileName, source) => {
  return async () => {
    const options = {
      url: `${endpoint}images`,
      method: "get",
      params: {
        fileName,
      },
      timeout: 30000,
      cancelToken: source.token,
    };

    const res = await httpClient(options);

    return res;
  };
};

export const submitRectification = (
  auditID,
  data,
  userType,
  checklistType,
  section,
  index,
  rectified
) => {
  return async (dispatch) => {
    const options = {
      url: `${endpoint}audits/${auditID}/${userType}`,
      method: "patch",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data,
    };

    const res = await httpClient(options);

    dispatch({
      type: CHANGE_RECTIFY,
      checklistType,
      section,
      index,
      rectified,
    });

    return res;
  };
};
