import _ from "lodash";

import {
  ADD_AUDIT_TENANT_SELECTION,
  ADD_CHOSEN_CHECKLIST,
  ADD_IMAGE,
  DELETE_IMAGE,
  ADD_REMARKS,
  SET_MAXIMUM_SCORE,
  CHANGE_CURRENT_SCORE,
  CHANGE_MAXIMUM_SCORE,
} from "../actions/checklistActions";

const initialState = {
  chosen_tenant: null,
  chosen_checklist_type: null,
  chosen_checklist: null,
  maximum_score: 0,
  current_score: 0,
};

export const checklistReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_AUDIT_TENANT_SELECTION:
      return {
        ...state,
        chosen_tenant: action.tenant,
        chosen_checklist_type: null,
        chosen_checklist: null,
        maximum_score: 0,
        current_score: 0,
      };
    case ADD_CHOSEN_CHECKLIST: {
      return {
        ...state,
        chosen_checklist_type: action.checklist_type,
        chosen_checklist: _.cloneDeep(action.checklist),
        maximum_score: 0,
        current_score: 0,
      };
    }

    //TODO:
    case ADD_IMAGE: {
      const newChecklist = _.cloneDeep(state.chosen_checklist);
      if (newChecklist.questions[action.index].image == null) {
        newChecklist.questions[action.index].image = [];
      }
      newChecklist.questions[action.index].image.push(action.imageUri);
      // console.log(newChecklist.questions);

      return {
        ...state,
        chosen_checklist: newChecklist,
      };
    }
    case DELETE_IMAGE: {
      const newChecklist = _.cloneDeep(state.chosen_checklist);
      newChecklist.questions[action.index].image.splice(
        action.selectedIndex,
        1
      );

      // console.log(newChecklist.questions[action.index].image.uri);

      return {
        ...state,
        chosen_checklist: newChecklist,
      };
    }
    case ADD_REMARKS: {
      const newChecklist = _.cloneDeep(state.chosen_checklist);
      if (newChecklist.questions[action.index].remarks == null) {
        newChecklist.questions[action.index].remarks = "";
      }
      newChecklist.questions[action.index].remarks = action.remarks;

      return {
        ...state,
        chosen_checklist: newChecklist,
      };
    }
    case SET_MAXIMUM_SCORE: {
      return {
        ...state,
        maximum_score: action.score,
      };
    }
    case CHANGE_CURRENT_SCORE: {
      let new_current_score;
      if (action.change) {
        new_current_score = state.current_score + 1;
      } else {
        new_current_score = state.current_score - 1;
      }
      return {
        ...state,
        current_score: new_current_score,
      };
    }
    case CHANGE_MAXIMUM_SCORE: {
      console.log(action.checked);
      let new_maximum_score;
      let new_current_score = state.current_score;
      if (action.change) {
        new_maximum_score = state.maximum_score + 1;
        if (action.checked) {
          new_current_score++;
        }
      } else {
        new_maximum_score = state.maximum_score - 1;
        if (action.checked) {
          new_current_score--;
        }
      }
      return {
        ...state,
        maximum_score: new_maximum_score,
        current_score: new_current_score,
      };
    }
    default:
      return state;
  }
};
