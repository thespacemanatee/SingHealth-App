import AsyncStorage from "@react-native-async-storage/async-storage";

import { endpoint, httpClient } from "../../helpers/CustomHTTPClient";

export const RESTORE_TOKEN = "RESTORE_TOKEN";
export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";

export const restoreToken = () => {
  return async (dispatch) => {
    try {
      const cache = await AsyncStorage.getItem("userData");
      const userData = JSON.parse(cache);
      console.log("RESTORING TOKEN: ", userData);

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: RESTORE_TOKEN, userData });
    } catch (err) {
      // Restoring token failed
      console.error("RESTORE_TOKEN: no token found in local storage");
    }
  };
};

export const signIn = (user, pswd, expoToken, userType) => {
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
    const { _id, email, institutionID, name, stall } = res.data.data;

    const userData = {
      userType,
      userToken,
      _id,
      email,
      institutionID,
      name,
      stall,
    };

    dispatch({ type: SIGN_IN, userData });
    saveUserDataToStorage(userData);
  };
};

export const signOut = () => {
  return async (dispatch) => {
    // dispatch({ action: SIGN_OUT, token: token ? token : null });
    console.log("Signing out!");
    const signOutOptions = {
      url: `${endpoint}logout`,
      method: "get",
      // withCredentials: true,
    };
    await httpClient(signOutOptions);

    dispatch({ type: SIGN_OUT });
    removeTokenFromStorage();
  };
};

const saveUserDataToStorage = async (userData) => {
  await AsyncStorage.setItem("userData", JSON.stringify(userData));
};

const removeTokenFromStorage = async () => {
  await AsyncStorage.removeItem("userData");
};
