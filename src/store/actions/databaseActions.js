import { endpoint, httpClient } from "../../helpers/CustomHTTPClient";

export const STORE_DATABASE = "STORE_DATABASE";
export const GET_RELEVANT_TENANTS = "GET_RELEVANT_TENANTS";

export const storeDatabase = (database) => {
  return { type: STORE_DATABASE, database };
};

export const getRelevantTenants = (institutionID) => {
  return async (dispatch, getState) => {
    // dispatch({ action: SIGN_IN, token: token ? token : null });

    const options = {
      url: `${endpoint}tenants/${institutionID}`,
      method: "get",
      withCredentials: true,
    };
    console.log(institutionID);
    const response = await httpClient(options);
    return response;
  };
};
