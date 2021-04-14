import AsyncStorage from "@react-native-async-storage/async-storage";

import { endpoint, httpClient } from "../../helpers/CustomHTTPClient";

export const RESTORE_TOKEN = "RESTORE_TOKEN";
export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";
export const SAVE_EXPO_TOKEN = "SAVE_EXPO_TOKEN";

export const restoreToken = () => {
  return async (dispatch) => {
    const cache = await AsyncStorage.getItem("userData");
    const userData = JSON.parse(cache);

    // After restoring token, we may need to validate it in production apps

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    dispatch({ type: RESTORE_TOKEN, userData });
  };
};

export const signIn = (user, pswd, userType, expoToken = "") => {
  return async (dispatch) => {
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

    const userToken = "dummy-auth-token";
    const { _id, email, institutionID, name, stallName } = res.data.data;

    const userData = {
      userType,
      userToken,
      _id,
      email,
      institutionID,
      name,
      stallName,
    };

    dispatch({ type: SIGN_IN, userData, expoToken });
    saveUserDataToStorage(userData);
  };
};

export const signOut = (expoToken) => {
  return async (dispatch) => {
    // dispatch({ action: SIGN_OUT, token: token ? token : null });
    removeTokenFromStorage();
    dispatch({ type: SIGN_OUT });
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
  };
};

export const saveExpoToken = (expoToken) => ({
  type: SAVE_EXPO_TOKEN,
  expoToken,
});

const saveUserDataToStorage = async (userData) => {
  await AsyncStorage.setItem("userData", JSON.stringify(userData));
};

const removeTokenFromStorage = async () => {
  await AsyncStorage.removeItem("userData");
};
