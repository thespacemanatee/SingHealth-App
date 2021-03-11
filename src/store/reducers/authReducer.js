import { RESTORE_TOKEN, SIGN_IN, SIGN_OUT } from "../actions/authActions";

const initialState = {
  isLoading: true,
  isSignOut: false,
  userToken: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESTORE_TOKEN:
      return {
        ...state,
        userToken: action.token,
        isLoading: false,
      };
    case SIGN_IN:
      return {
        ...state,
        isSignOut: false,
        userToken: action.token,
      };
    case SIGN_OUT:
      return {
        ...state,
        isSignOut: true,
        userToken: null,
      };

    default:
      return state;
  }
};
