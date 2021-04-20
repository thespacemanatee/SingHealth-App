import _ from "lodash";

import {
  ADD_AUDIT_TENANT_SELECTION,
  ADD_CHOSEN_CHECKLIST,
  CREATE_AUDIT_METADATA,
  ADD_SAVED_CHECKLIST,
  ADD_IMAGE,
  DELETE_IMAGE,
  ADD_REMARKS,
  ADD_COVID_CHECKLIST,
  CHANGE_ANSWER,
  CHANGE_DEADLINE,
  RESET_CHECKLIST_STORE,
  GET_AUDIT_DATA,
  CHANGE_RECTIFY,
  CLEAR,
} from "../actions/checklistActions";

const initialState = {
  chosen_tenant: null,
  chosen_checklist_type: null,
  chosen_checklist: null,
  covid19: null,
  auditMetadata: null,
};

const checklistReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_AUDIT_TENANT_SELECTION:
      return {
        ...state,
        chosen_tenant: action.tenant,
      };

    case ADD_CHOSEN_CHECKLIST:
      return {
        ...state,
        chosen_checklist_type: action.checklistType,
        chosen_checklist: action.checklist,
      };

    case ADD_COVID_CHECKLIST:
      return {
        ...state,
        covid19: action.checklist,
      };

    case CREATE_AUDIT_METADATA:
      return {
        ...state,
        auditMetadata: action.auditMetadata,
      };

    case ADD_SAVED_CHECKLIST:
      return {
        ...action.data,
      };

    case ADD_IMAGE: {
      let newChecklist;
      if (action.checklistType === "covid19") {
        newChecklist = _.cloneDeep(state.covid19);
      } else {
        newChecklist = _.cloneDeep(state.chosen_checklist);
      }
      let image = "image";

      if (action.rectify) {
        image = "rectificationImages";
      }

      if (newChecklist.questions[action.section][action.index][image] == null) {
        newChecklist.questions[action.section][action.index][image] = [];
      }

      const temp = newChecklist.questions[action.section][action.index][image];

      if (!temp.some((e) => e.name === action.fileName)) {
        const imageObject = {
          name: action.fileName,
          uri: action.imageUri,
        };

        temp.push(imageObject);
      }

      newChecklist.questions[action.section][action.index][image] = temp.filter(
        (e) => e !== action.fileName
      );

      if (action.checklistType === "covid19") {
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
      if (action.checklistType === "covid19") {
        newChecklist = _.cloneDeep(state.covid19);
      } else {
        newChecklist = _.cloneDeep(state.chosen_checklist);
      }

      let image = "image";

      if (action.rectify) {
        image = "rectificationImages";
      }

      newChecklist.questions[action.section][action.index][image].splice(
        action.selectedIndex,
        1
      );

      if (action.checklistType === "covid19") {
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
      if (action.checklistType === "covid19") {
        newChecklist = _.cloneDeep(state.covid19);
      } else {
        newChecklist = _.cloneDeep(state.chosen_checklist);
      }

      let remarks = "remarks";

      if (action.rectify) {
        remarks = "rectificationRemarks";
      }

      if (
        newChecklist.questions[action.section][action.index][remarks] == null
      ) {
        newChecklist.questions[action.section][action.index][remarks] = "";
      }
      newChecklist.questions[action.section][action.index][remarks] =
        action.remarks;

      if (action.checklistType === "covid19") {
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
      if (action.checklistType === "covid19") {
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

      if (action.checklistType === "covid19") {
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
      if (action.checklistType === "covid19") {
        newChecklist = _.cloneDeep(state.covid19);
      } else {
        newChecklist = _.cloneDeep(state.chosen_checklist);
      }

      newChecklist.questions[action.section][action.index].deadline =
        action.date;

      if (action.checklistType === "covid19") {
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
    case RESET_CHECKLIST_STORE: {
      return {
        chosen_tenant: null,
        chosen_checklist_type: null,
        chosen_checklist: null,
        covid19: null,
      };
    }

    case GET_AUDIT_DATA: {
      return {
        chosen_tenant: action.chosen_tenant,
        chosen_checklist_type: action.chosen_checklist_type,
        chosen_checklist: action.chosen_checklist,
        covid19: action.covid19,
        auditMetadata: action.auditMetadata,
      };
    }

    case CHANGE_RECTIFY: {
      let newChecklist;
      if (action.checklistType === "covid19") {
        newChecklist = _.cloneDeep(state.covid19);
      } else {
        newChecklist = _.cloneDeep(state.chosen_checklist);
      }

      newChecklist.questions[action.section][action.index].rectified =
        action.rectified;

      if (action.checklistType === "covid19") {
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

    case CLEAR:
      return initialState;

    default:
      return state;
  }
};

export default checklistReducer;
