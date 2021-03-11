export const RESTORE_TOKEN = "RESTORE_TOKEN";
export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";

export const restoreToken = () => {
  return async (dispatch, getState) => {
    let userToken;

    try {
      userToken = await AsyncStorage.getItem("userToken");
    } catch (e) {
      // Restoring token failed
    }

    // After restoring token, we may need to validate it in production apps

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    dispatch({ type: RESTORE_TOKEN, token: userToken });
  };
};

export const signIn = (token) => {
  return async (dispatch, getState) => {
    dispatch({ action: SIGN_IN, token: token });
  };
};

export const signOut = () => {
  return async (dispatch, getState) => {
    dispatch({ action: SIGN_OUT, token: token });
  };
};
