import { endpoint, httpClient } from "../../helpers/CustomHTTPClient";

export const GET_RELEVANT_TENANTS = "GET_RELEVANT_TENANTS";
export const GET_INSTITUTIONS = "GET_INSTITUTIONS";
export const GET_ACTIVE_AUDITS = "GET_ACTIVE_AUDITS";
export const GET_GRAPH_DATA = "GET_GRAPH_DATA";
export const STORE_GRAPH_DATA = "STORE_GRAPH_DATA";
export const GET_NOTIFICATIONS = "GET_NOTIFICATIONS";
export const CLEAR = "CLEAR";

export const getInstitutions = () => {
  return async (dispatch) => {
    const options = {
      url: `${endpoint}institutions`,
      method: "get",
    };

    const res = await httpClient(options);
    dispatch({ type: GET_INSTITUTIONS, institutions: res.data.data });
    return res;
  };
};

export const getRelevantTenants = (institutionID) => {
  return async (dispatch) => {
    const options = {
      url: `${endpoint}tenants`,
      method: "get",
      params: { institutionID },
    };

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
    dispatch({ type: GET_ACTIVE_AUDITS, activeAudits: res.data.data });
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
    dispatch({ type: GET_ACTIVE_AUDITS, activeAudits: res.data.data });
    return res;
  };
};

export const getTenantAudits = (tenantID, daysBefore = 0) => {
  return async () => {
    const options = {
      url: `${endpoint}audits`,
      method: "get",
      params: { tenantID, daysBefore },
    };

    const res = await httpClient(options);

    return res;
  };
};

export const postAuditForm = (auditData) => {
  return async () => {
    const options = {
      url: `${endpoint}audits`,
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: auditData,
    };

    const res = await httpClient(options);

    return res;
  };
};

export const exportAndEmail = (auditID) => {
  return async () => {
    const options = {
      url: `${endpoint}email/word/${auditID}`,
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

export const getGraphData = (fromDate, toDate, dataType, dataID) => {
  return async () => {
    const options = {
      url: `${endpoint}auditTimeframe`,
      method: "get",
      params: { fromDate, toDate, dataType, dataID },
    };

    const res = await httpClient(options);

    return res;
  };
};

export const storeGraphData = (graphData) => {
  return { type: STORE_GRAPH_DATA, graphData };
};

export const deleteTenant = (tenantID) => {
  return async () => {
    const options = {
      url: `${endpoint}tenant`,
      method: "delete",
      params: { tenantID },
    };

    const res = await httpClient(options);

    return res;
  };
};

export const getNotifications = (userID) => {
  return async (dispatch) => {
    const options = {
      url: `${endpoint}notifications`,
      method: "get",
      params: { userID },
    };

    const res = await httpClient(options);
    dispatch({ type: GET_NOTIFICATIONS, notifications: res.data.data });
    return res;
  };
};

export const clear = () => {
  return { type: CLEAR };
};
