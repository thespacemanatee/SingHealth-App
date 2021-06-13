import {
  RESTORE_TOKEN,
  SIGN_IN,
  SIGN_OUT,
  SAVE_EXPO_TOKEN,
} from "../actions/authActions";

const initialState = {
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

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESTORE_TOKEN: {
      const { userType, _id, email, institutionID, name, stallName } =
        action.userData;

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
    }
    case SIGN_IN: {
      const { userType, _id, email, institutionID, name, stallName } =
        action.userData;
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
    }
    case SIGN_OUT:
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

    case SAVE_EXPO_TOKEN:
      return {
        ...state,
        expoToken: action.expoToken,
      };

    default:
      return state;
  }
};

export default authReducer;
