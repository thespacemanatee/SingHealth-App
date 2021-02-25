import {
  ADD_AUDIT_TENANT_SELECTION,
  ADD_CHOSEN_CHECKLIST,
  ADD_IMAGE,
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
    case ADD_IMAGE: {
      const newChecklist = state.chosen_checklist;
      if (newChecklist.questions[action.index].image.uri == null) {
        newChecklist.questions[action.index].image.uri = [];
      }
      newChecklist.questions[action.index].image.uri.push(action.imageUri);
      console.log(newChecklist.questions);

      return {
        ...state,
        chosen_checklist: newChecklist,
      };
    }
    default:
      return state;
  }
};
