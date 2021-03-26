import { endpoint, httpClient } from "../../helpers/CustomHTTPClient";

export const GET_RELEVANT_TENANTS = "GET_RELEVANT_TENANTS";
export const GET_TENANT_ACTIVE_AUDITS = "GET_TENANT_ACTIVE_AUDITS";
export const GET_STAFF_ACTIVE_AUDITS = "GET_STAFF_ACTIVE_AUDITS";

export const getRelevantTenants = (institutionID) => {
  return async (dispatch) => {
    const options = {
      url: `${endpoint}tenants/${institutionID}`,
      method: "get",
      // withCredentials: true,
    };
    console.log(institutionID);
    const res = await httpClient(options);
    dispatch({ type: GET_RELEVANT_TENANTS, relevantTenants: res.data });
    return res;
  };
};

export const getTenantActiveAudits = (tenantID, daysBefore = 0) => {
  return async (dispatch) => {
    const options = {
      url: `${endpoint}audits/unrectified/recent/tenant/${tenantID}/${daysBefore}`,
      method: "get",
      // withCredentials: true,
    };
    const res = await httpClient(options);
    dispatch({ type: GET_TENANT_ACTIVE_AUDITS, activeAudits: res.data });
    return res;
  };
};

export const getStaffActiveAudits = (institutionID, daysBefore = 0) => {
  return async (dispatch) => {
    const options = {
      url: `${endpoint}audits/unrectified/recent/staff/${institutionID}/${daysBefore}`,
      method: "get",
      // withCredentials: true,
    };
    const res = await httpClient(options);
    dispatch({ type: GET_STAFF_ACTIVE_AUDITS, activeAudits: res.data });
    return res;
  };
};

export const postAuditForm = (auditData) => {
  return async () => {
    console.log(auditData);
    const postAudit = {
      url: `${endpoint}audits`,
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: auditData,
    };

    const res = await httpClient(postAudit);

    return res;
  };
};

export const postAuditImages = (formData) => {
  return async () => {
    const postImages = {
      url: `${endpoint}images`,
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data: formData,
      timeout: 30000,
    };
    const res = await httpClient(postImages);

    return res;
  };
};

export const postAuditImagesWeb = (base64images) => {
  return async () => {
    const postImagesWeb = {
      url: `${endpoint}images`,
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: base64images,
      timeout: 30000,
    };
    const res = await httpClient(postImagesWeb);

    return res;
  };
};
