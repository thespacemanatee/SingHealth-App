import { STORE_RELEVANT_AUDITS } from "../actions/databaseActions";

const initialState = {
  relevantAudits: [],
};

export const databaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_RELEVANT_AUDITS:
      return { ...state, relevantAudits: action.audits };
    default:
      return state;
  }
};
