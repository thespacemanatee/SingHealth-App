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
