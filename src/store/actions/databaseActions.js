import { endpoint, httpClient } from "../../helpers/CustomHTTPClient";

export const GET_RELEVANT_TENANTS = "GET_RELEVANT_TENANTS";
export const GET_INSTITUTIONS = "GET_INSTITUTIONS";
export const GET_TENANT_ACTIVE_AUDITS = "GET_TENANT_ACTIVE_AUDITS";
export const GET_STAFF_ACTIVE_AUDITS = "GET_STAFF_ACTIVE_AUDITS";

export const getInstitutions = () => {
  return async (dispatch) => {
    const options = {
      url: `${endpoint}institutions`,
      method: "get",
      // withCredentials: true,
    };
    const res = await httpClient(options);
    dispatch({ type: GET_RELEVANT_TENANTS, institutions: res.data.data });
    return res;
  };
};

export const getRelevantTenants = (institutionID) => {
  return async (dispatch) => {
    const options = {
      url: `${endpoint}tenants/${institutionID}`,
      method: "get",
      // withCredentials: true,
    };
    console.log(institutionID);
    const res = await httpClient(options);
    dispatch({ type: GET_RELEVANT_TENANTS, relevantTenants: res.data.data });
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
    dispatch({ type: GET_TENANT_ACTIVE_AUDITS, activeAudits: res.data.data });
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
    dispatch({ type: GET_STAFF_ACTIVE_AUDITS, activeAudits: res.data.data });
    return res;
  };
};

export const getTenantAudits = (tenantID, daysBefore = 0) => {
  return async () => {
    const getAudit = {
      url: `${endpoint}audits`,
      method: "get",
      params: { tenantID, daysBefore },
    };

    const res = await httpClient(getAudit);

    return res;
  };
};

export const postAuditForm = (auditData) => {
  return async () => {
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

export const postAuditImages = (data) => {
  return async () => {
    const postImages = {
      url: `${endpoint}images`,
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data,
      timeout: 50000,
    };
    const res = await httpClient(postImages);

    return res;
  };
};

export const postAuditImagesWeb = (data) => {
  return async () => {
    const postImagesWeb = {
      url: `${endpoint}images`,
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data,
      timeout: 50000,
    };
    const res = await httpClient(postImagesWeb);

    return res;
  };
};

export const exportAndEmail = (auditID) => {
  return async () => {
    const options = {
      url: `${endpoint}email/${auditID}`,
      method: "post",
    };

    const res = await httpClient(options);

    return res;
  };
};

export const createNewTenant = (data) => {
  return async () => {
    const options = {
      url: `${endpoint}tenant`,
      method: "post",
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
