import { endpoint, httpClient } from "../../helpers/CustomHTTPClient";

export const getRelevantTenants = (institutionID) => {
  return async () => {
    // dispatch({ action: SIGN_IN, token: token ? token : null });

    const options = {
      url: `${endpoint}tenants/${institutionID}`,
      method: "get",
      // withCredentials: true,
    };
    console.log(institutionID);
    const response = await httpClient(options);
    return response;
  };
};

export const getTenantActiveAudits = (tenantID, daysBefore = 0) => {
  return async () => {
    // dispatch({ action: SIGN_IN, token: token ? token : null });
    const options = {
      url: `${endpoint}audits/unrectified/recent/tenant/${tenantID}/${daysBefore}`,
      method: "get",
      // withCredentials: true,
    };
    const response = await httpClient(options);
    return response;
  };
};

export const getStaffActiveAudits = (institutionID, daysBefore = 0) => {
  return async () => {
    // dispatch({ action: SIGN_IN, token: token ? token : null });
    const options = {
      url: `${endpoint}audits/unrectified/recent/staff/${institutionID}/${daysBefore}`,
      method: "get",
      // withCredentials: true,
    };
    const response = await httpClient(options);
    return response;
  };
};
