/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Moment } from "moment";

import { endpoint, httpClient } from "../../helpers/CustomHTTPClient";

export const getInstitutions = createAsyncThunk(
  "database/getInstitutions",
  async () => {
    const options = {
      url: `${endpoint}institutions`,
      method: "get",
    };

    const res = await httpClient(options);

    return res.data.data;
  }
);

export const getRelevantTenants = createAsyncThunk(
  "database/getRelevantTenants",
  async (payload: { institutionID: string }) => {
    const { institutionID } = payload;
    const options = {
      url: `${endpoint}tenants`,
      method: "get",
      params: { institutionID },
    };

    const res = await httpClient(options);

    return res.data.data;
  }
);

export const getStaffActiveAudits = createAsyncThunk(
  "database/getStaffActiveAudits",
  async (payload: { institutionID: string; daysBefore: number }) => {
    const { institutionID, daysBefore = 0 } = payload;
    const options = {
      url: `${endpoint}audits/unrectified/recent/tenant/${institutionID}/${daysBefore}`,
      method: "get",
      // withCredentials: true,
    };

    const res = await httpClient(options);

    return res.data.data;
  }
);

export const getTenantActiveAudits = createAsyncThunk(
  "database/getTenantActiveAudits",
  async (payload: { tenantID: string; daysBefore: number }) => {
    const { tenantID, daysBefore = 0 } = payload;
    const options = {
      url: `${endpoint}audits/unrectified/recent/tenant/${tenantID}/${daysBefore}`,
      method: "get",
      // withCredentials: true,
    };

    const res = await httpClient(options);

    return res.data.data;
  }
);
export const getTenantAudits = createAsyncThunk(
  "database/getTenantAudits",
  async (payload: { tenantID: string; daysBefore: number }) => {
    const { tenantID, daysBefore = 0 } = payload;
    const options = {
      url: `${endpoint}audits`,
      method: "get",
      params: { tenantID, daysBefore },
    };

    const res = await httpClient(options);

    return res.data.data;
  }
);

export const postAuditForm = createAsyncThunk(
  "database/postAuditForm",
  async (payload: { auditData: any }) => {
    const { auditData } = payload;
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

    return res.data.data;
  }
);

export const postAuditImages = createAsyncThunk(
  "database/postAuditImages",
  async (payload: { data: any }) => {
    const { data } = payload;
    const options = {
      url: `${endpoint}images`,
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data,
      timeout: 50000,
    };

    const res = await httpClient(options);

    return res.data.data;
  }
);

export const postAuditImagesWeb = createAsyncThunk(
  "database/postAuditImagesWeb",
  async (payload: { data: any }) => {
    const { data } = payload;
    const options = {
      url: `${endpoint}images`,
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data,
      timeout: 50000,
    };

    const res = await httpClient(options);

    return res.data.data;
  }
);

export const exportAndEmail = createAsyncThunk(
  "database/postAuditImagesWeb",
  async (payload: { auditID: string }) => {
    const { auditID } = payload;
    const options = {
      url: `${endpoint}email/word/${auditID}`,
      method: "post",
    };

    const res = await httpClient(options);

    return res.data.data;
  }
);

export const createNewTenant = createAsyncThunk(
  "database/postAuditImagesWeb",
  async (payload: { data: any }) => {
    const { data } = payload;
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

    return res.data.data;
  }
);

export const getGraphData = createAsyncThunk(
  "database/getGraphData",
  async (payload: {
    fromDate: number;
    toDate: number;
    dataType: string;
    dataID: string;
  }) => {
    const { fromDate, toDate, dataType, dataID } = payload;
    const options = {
      url: `${endpoint}auditTimeframe`,
      method: "get",
      params: { fromDate, toDate, dataType, dataID },
    };

    const res = await httpClient(options);

    return res.data.data;
  }
);

export const deleteTenant = createAsyncThunk(
  "database/deleteTenant",
  async (payload: { tenantID: string }) => {
    const { tenantID } = payload;
    const options = {
      url: `${endpoint}tenant`,
      method: "delete",
      params: { tenantID },
    };

    const res = await httpClient(options);

    return res.data.data;
  }
);

export const getNotifications = createAsyncThunk(
  "database/getNotifications",
  async (payload: { userID: string }) => {
    const { userID } = payload;
    const options = {
      url: `${endpoint}notifications`,
      method: "get",
      params: { userID },
    };

    const res = await httpClient(options);

    return res.data.data;
  }
);

// Define a type for the slice state
interface DatabaseState {
  institutions: string[];
  relevantTenants: string[];
  activeAudits: string[];
  graphData: {};
  notifications: {};
}

// Define the initial state using that type
const initialState: DatabaseState = {
  institutions: [],
  relevantTenants: [],
  activeAudits: [],
  graphData: {},
  notifications: null,
};

export const databaseSlice = createSlice({
  name: "database",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    storeGraphData: (state, action: PayloadAction<any>) => {
      state.graphData = action.payload.graphData;
    },
    clearDatabase: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getInstitutions.fulfilled, (state, { payload }) => {
      state.institutions = payload;
    });
    builder.addCase(getRelevantTenants.fulfilled, (state, { payload }) => {
      state.relevantTenants = payload;
    });
    builder.addCase(getStaffActiveAudits.fulfilled, (state, { payload }) => {
      state.activeAudits = payload;
    });
    builder.addCase(getTenantActiveAudits.fulfilled, (state, { payload }) => {
      state.activeAudits = payload;
    });
    builder.addCase(getNotifications.fulfilled, (state, { payload }) => {
      const read = payload.filter((notification) => notification.readReceipt);
      const unread = payload.filter(
        (notification) => !notification.readReceipt
      );
      state.notifications = { read, unread };
    });
  },
});

export const { storeGraphData, clearDatabase } = databaseSlice.actions;

export default databaseSlice.reducer;
