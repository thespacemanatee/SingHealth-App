import {
  ADD_AUDIT_TENANT_SELECTION,
  ADD_CHOSEN_CHECKLIST,
} from "../actions/checklistActions";

const initialState = {
  chosen_tenant: null,
  chosen_checklist: {},
};

export const checklistReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_AUDIT_TENANT_SELECTION:
      return {
        ...state,
        chosen_tenant: action.tenant,
      };
    case ADD_CHOSEN_CHECKLIST: {
      return {
        ...state,
        chosen_checklist: action.checklist,
      };
    }
    default:
      return state;
  }
};
