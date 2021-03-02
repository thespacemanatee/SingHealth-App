import _ from "lodash";

import {
  ADD_AUDIT_TENANT_SELECTION,
  ADD_CHOSEN_CHECKLIST,
  ADD_IMAGE,
  ADD_REMARKS,
} from "../actions/checklistActions";

const initialState = {
  chosen_tenant: null,
  chosen_checklist: null,
};

export const checklistReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_AUDIT_TENANT_SELECTION:
      return {
        ...state,
        chosen_tenant: action.tenant,
        chosen_checklist: null,
      };
    case ADD_CHOSEN_CHECKLIST: {
      return {
        ...state,
        chosen_checklist: _.cloneDeep(action.checklist),
      };
    }
    case ADD_IMAGE: {
      const newChecklist = _.cloneDeep(state.chosen_checklist);
      if (newChecklist.questions[action.index].image.uri == null) {
        newChecklist.questions[action.index].image.uri = [];
      }
      newChecklist.questions[action.index].image.uri.push(action.imageUri);
      // console.log(newChecklist.questions);

      return {
        ...state,
        chosen_checklist: newChecklist,
      };
    }
    case ADD_REMARKS: {
      const newChecklist = _.cloneDeep(state.chosen_checklist);
      if (newChecklist.questions[action.index].image.remarks == null) {
        newChecklist.questions[action.index].image.remarks = "";
      }
      newChecklist.questions[action.index].image.remarks = action.remarks;

      return {
        ...state,
        chosen_checklist: newChecklist,
      };
    }
    default:
      return state;
  }
};
