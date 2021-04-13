import {
  RESTORE_TOKEN,
  SIGN_IN,
  SIGN_OUT,
  SAVE_EXPO_TOKEN,
} from "../actions/authActions";

const initialState = {
  isLoading: true,
  isSignOut: false,
  userToken: null,
  userType: null,
  expoToken: null,
  _id: null,
  email: null,
  institutionID: null,
  name: null,
  stallName: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESTORE_TOKEN: {
      const {
        userToken,
        userType,
        _id,
        email,
        institutionID,
        name,
        stallName,
      } = action.userData;

      return {
        ...state,
        userToken,
        userType,
        _id,
        email,
        institutionID,
        name,
        isLoading: false,
        stallName,
      };
    }
    case SIGN_IN: {
      const {
        userToken,
        userType,
        _id,
        email,
        institutionID,
        name,
        stallName,
      } = action.userData;
      return {
        ...state,
        isSignOut: false,
        userToken,
        userType,
        _id,
        email,
        institutionID,
        name,
        stallName,
      };
    }
    case SIGN_OUT: {
      return {
        ...state,
        isLoading: false,
        isSignOut: true,
        userToken: null,
        userType: null,
        _id: null,
        email: null,
        institutionID: null,
        name: null,
      };
    }
    case SAVE_EXPO_TOKEN: {
      return {
        ...state,
        expoToken: action.expoToken,
      };
    }

    default:
      return state;
  }
};

export default authReducer;
