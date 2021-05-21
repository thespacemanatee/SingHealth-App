/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { endpoint, httpClient } from "../../helpers/CustomHTTPClient";

export const restoreToken = createAsyncThunk("auth/restoreToken", async () => {
  const cache = await AsyncStorage.getItem("userData");
  const userData = JSON.parse(cache);

  return userData;
});

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (payload: {
    user: string;
    pswd: string;
    userType: string;
    expoToken: string;
  }) => {
    const { user, pswd, userType, expoToken = "" } = payload;
    console.log(user, pswd, userType, expoToken);
    const loginOptions = {
      url: `${endpoint}login/${userType}`,
      method: "post",
      // withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        user,
        pswd,
        expoToken,
      },
    };

    const res = await httpClient(loginOptions);

    const { _id, email, institutionID, name, stallName } = res.data.data;

    const userData = {
      userType,
      _id,
      email,
      institutionID,
      name,
      stallName,
    };

    saveUserDataToStorage(userData);
    return { userData, expoToken };
  }
);

export const signOut = createAsyncThunk(
  "auth/signOut",
  async (payload: { expoToken: string }) => {
    const { expoToken } = payload;
    removeTokenFromStorage();
    const signOutOptions = {
      url: `${endpoint}logout`,
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        expoToken,
      },
    };
    await httpClient(signOutOptions);
  }
);

const saveUserDataToStorage = async (userData) => {
  await AsyncStorage.setItem("userData", JSON.stringify(userData));
};

const removeTokenFromStorage = async () => {
  await AsyncStorage.removeItem("userData");
};

// Define a type for the slice state
interface AuthState {
  isLoading: boolean;
  isSignOut: boolean;
  userType: string;
  expoToken: string;
  _id: string;
  email: string;
  institutionID: string;
  name: string;
  stallName: string;
}

// Define the initial state using that type
const initialState: AuthState = {
  isLoading: true,
  isSignOut: false,
  userType: null,
  expoToken: null,
  _id: null,
  email: null,
  institutionID: null,
  name: null,
  stallName: null,
};

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    saveExpoToken: (state, action: PayloadAction<string>) => {
      state.expoToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(restoreToken.fulfilled, (state, { payload }) => {
      const { userType, _id, email, institutionID, name, stallName } =
        payload.userData;
      return {
        ...state,
        userType,
        _id,
        email,
        institutionID,
        name,
        isLoading: false,
        stallName,
      };
    });
    builder.addCase(signIn.fulfilled, (state, { payload }) => {
      const { userType, _id, email, institutionID, name, stallName } =
        payload.userData;
      return {
        ...state,
        isSignOut: false,
        userType,
        _id,
        email,
        institutionID,
        name,
        stallName,
      };
    });
    builder.addCase(signOut.fulfilled, (state) => {
      return {
        ...state,
        isLoading: false,
        isSignOut: true,
        userType: null,
        _id: null,
        email: null,
        institutionID: null,
        name: null,
      };
    });
  },
});

export const { saveExpoToken } = authSlice.actions;

export default authSlice.reducer;
