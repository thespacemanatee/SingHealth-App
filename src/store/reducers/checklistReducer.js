import _ from "lodash";

import {
  ADD_AUDIT_TENANT_SELECTION,
  ADD_CHOSEN_CHECKLIST,
  ADD_IMAGE,
  DELETE_IMAGE,
  ADD_REMARKS,
  ADD_COVID_CHECKLIST,
  CHANGE_ANSWER,
  CHANGE_DEADLINE,
} from "../actions/checklistActions";

const initialState = {
  chosen_tenant: null,
  chosen_checklist_type: null,
  chosen_checklist: null,
  covid19: null,
};

const checklistReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_AUDIT_TENANT_SELECTION:
      return {
        ...state,
        chosen_tenant: action.tenant,
        chosen_checklist_type: null,
        chosen_checklist: null,
        // maximum_score: 0,
        // current_score: 0,
      };
    case ADD_CHOSEN_CHECKLIST: {
      return {
        ...state,
        chosen_checklist_type: action.checklist_type,
        chosen_checklist: _.cloneDeep(action.checklist),
        // maximum_score: 0,
        // current_score: 0,
      };
    }

    case ADD_COVID_CHECKLIST: {
      return {
        ...state,
        covid19: _.cloneDeep(action.checklist),
        // maximum_score: 0,
        // current_score: 0,
      };
    }

    // TODO:
    case ADD_IMAGE: {
      let newChecklist;
      if (
        Object.prototype.hasOwnProperty.call(
          state.covid19.questions,
          action.section
        )
      ) {
        newChecklist = _.cloneDeep(state.covid19);
      } else {
        newChecklist = _.cloneDeep(state.chosen_checklist);
      }
      if (newChecklist.questions[action.section][action.index].image == null) {
        newChecklist.questions[action.section][action.index].image = [];
      }
      newChecklist.questions[action.section][action.index].image.push(
        action.imageUri
      );
      // console.log(newChecklist.questions);

      if (
        Object.prototype.hasOwnProperty.call(
          state.covid19.questions,
          action.section
        )
      ) {
        return {
          ...state,
          covid19: newChecklist,
        };
      }
      return {
        ...state,
        chosen_checklist: newChecklist,
      };
    }
    case DELETE_IMAGE: {
      let newChecklist;
      if (
        Object.prototype.hasOwnProperty.call(
          state.covid19.questions,
          action.section
        )
      ) {
        newChecklist = _.cloneDeep(state.covid19);
      } else {
        newChecklist = _.cloneDeep(state.chosen_checklist);
      }
      newChecklist.questions[action.section][action.index].image.splice(
        action.selectedIndex,
        1
      );

      // console.log(newChecklist.questions[action.index].image.uri);
      if (
        Object.prototype.hasOwnProperty.call(
          state.covid19.questions,
          action.section
        )
      ) {
        return {
          ...state,
          covid19: newChecklist,
        };
      }

      return {
        ...state,
        chosen_checklist: newChecklist,
      };
    }
    case ADD_REMARKS: {
      let newChecklist;
      if (
        Object.prototype.hasOwnProperty.call(
          state.covid19.questions,
          action.section
        )
      ) {
        newChecklist = _.cloneDeep(state.covid19);
      } else {
        newChecklist = _.cloneDeep(state.chosen_checklist);
      }
      if (
        newChecklist.questions[action.section][action.index].remarks == null
      ) {
        newChecklist.questions[action.section][action.index].remarks = "";
      }
      newChecklist.questions[action.section][action.index].remarks =
        action.remarks;

      if (
        Object.prototype.hasOwnProperty.call(
          state.covid19.questions,
          action.section
        )
      ) {
        return {
          ...state,
          covid19: newChecklist,
        };
      }

      return {
        ...state,
        chosen_checklist: newChecklist,
      };
    }
    case CHANGE_ANSWER: {
      let newChecklist;
      if (
        Object.prototype.hasOwnProperty.call(
          state.covid19.questions,
          action.section
        )
      ) {
        newChecklist = _.cloneDeep(state.covid19);
      } else {
        newChecklist = _.cloneDeep(state.chosen_checklist);
      }
      if (action.deleted) {
        newChecklist.questions[action.section][action.index].answer = null;
      } else if (action.checked) {
        newChecklist.questions[action.section][action.index].answer = true;
      } else {
        newChecklist.questions[action.section][action.index].answer = false;
      }

      console.log(newChecklist);

      if (
        Object.prototype.hasOwnProperty.call(
          state.covid19.questions,
          action.section
        )
      ) {
        return {
          ...state,
          covid19: newChecklist,
        };
      }

      return {
        ...state,
        chosen_checklist: newChecklist,
      };
    }
    case CHANGE_DEADLINE: {
      let newChecklist;
      if (
        Object.prototype.hasOwnProperty.call(
          state.covid19.questions,
          action.section
        )
      ) {
        newChecklist = _.cloneDeep(state.covid19);
      } else {
        newChecklist = _.cloneDeep(state.chosen_checklist);
      }

      newChecklist.questions[action.section][action.index].deadline =
        action.date;

      console.log(newChecklist);

      if (
        Object.prototype.hasOwnProperty.call(
          state.covid19.questions,
          action.section
        )
      ) {
        return {
          ...state,
          covid19: newChecklist,
        };
      }

      return {
        ...state,
        chosen_checklist: newChecklist,
      };
    }

    default:
      return state;
  }
};

export default checklistReducer;
