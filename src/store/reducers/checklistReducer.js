import _ from "lodash";

import {
  ADD_AUDIT_TENANT_SELECTION,
  ADD_CHOSEN_CHECKLIST,
  ADD_SAVED_CHECKLIST,
  ADD_IMAGE,
  DELETE_IMAGE,
  ADD_REMARKS,
  ADD_COVID_CHECKLIST,
  CHANGE_ANSWER,
  CHANGE_DEADLINE,
  RESET_CHECKLIST_STORE,
  GET_AUDIT_DATA,
  RECTIFY_CHOSEN_CHECKLIST,
  RECTIFY_COVID_CHECKLIST,
} from "../actions/checklistActions";

const initialState = {
  chosen_tenant: null,
  chosen_checklist_type: null,
  chosen_checklist: null,
  covid19: null,
  auditMetadata: null,
  rectify_chosen_checklist: null,
  rectify_covid_checklist: { covid19: [] },
};

const checklistReducer = (state = initialState, action) => {
  let covidKeys;
  if (state.covid19) {
    covidKeys = Object.keys(state.covid19.questions);
  }
  switch (action.type) {
    case ADD_AUDIT_TENANT_SELECTION:
      return {
        ...state,
        chosen_tenant: action.tenant,
      };
    case ADD_CHOSEN_CHECKLIST: {
      return {
        ...state,
        chosen_checklist_type: action.checklistType,
        chosen_checklist: action.checklist,
        rectify_chosen_checklist: { [action.checklistType]: [] },
      };
    }

    case ADD_COVID_CHECKLIST: {
      return {
        ...state,
        covid19: action.checklist,
      };
    }

    case ADD_SAVED_CHECKLIST: {
      return {
        ...action.data,
      };
    }

    case ADD_IMAGE: {
      let newChecklist;
      if (covidKeys.includes(action.section)) {
        newChecklist = _.cloneDeep(state.covid19);
      } else {
        newChecklist = _.cloneDeep(state.chosen_checklist);
      }
      if (newChecklist.questions[action.section][action.index].image == null) {
        newChecklist.questions[action.section][action.index].image = [];
      }

      const imageObject = {
        name: action.fileName,
        uri: action.imageUri,
      };
      const temp = newChecklist.questions[action.section][action.index].image;

      temp.push(imageObject);

      newChecklist.questions[action.section][action.index].image = temp.filter(
        (e) => e !== action.fileName
      );

      // console.log(newChecklist.questions);

      if (covidKeys.includes(action.section)) {
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
      if (covidKeys.includes(action.section)) {
        newChecklist = _.cloneDeep(state.covid19);
      } else {
        newChecklist = _.cloneDeep(state.chosen_checklist);
      }
      newChecklist.questions[action.section][action.index].image.splice(
        action.selectedIndex,
        1
      );

      // console.log(newChecklist.questions[action.index].image.uri);
      if (covidKeys.includes(action.section)) {
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
      if (covidKeys.includes(action.section)) {
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
      if (covidKeys.includes(action.section)) {
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

      if (covidKeys.includes(action.section)) {
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
      if (covidKeys.includes(action.section)) {
        newChecklist = _.cloneDeep(state.covid19);
      } else {
        newChecklist = _.cloneDeep(state.chosen_checklist);
      }

      newChecklist.questions[action.section][action.index].deadline =
        action.date;

      console.log(newChecklist);

      if (covidKeys.includes(action.section)) {
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

    case RECTIFY_CHOSEN_CHECKLIST: {
      const { category, index } = action.data;
      const key = Object.keys(state.rectify_chosen_checklist)[0];
      const temp = state.rectify_chosen_checklist[key];
      const found = temp.find(
        (e) => e.category === category && e.index === index
      );
      console.log("KEY", key, "FOUND:", found, "TEMP:", temp);
      if (found !== -1) {
        temp[found] = action.data;
      } else {
        temp.push(action.data);
      }
      return {
        ...state,
        rectify_chosen_checklist: { [key]: temp },
      };
    }

    case RECTIFY_COVID_CHECKLIST: {
      const { category, index } = action.data;
      const key = Object.keys(state.rectify_covid_checklist)[0];
      const temp = state.rectify_covid_checklist[key];
      const found = temp.find(
        (e) => e.category === category && e.index === index
      );
      console.log("KEY", key, "FOUND:", found, "TEMP:", temp);
      if (found !== -1) {
        temp[found] = action.data;
      } else {
        temp.push(action.data);
      }
      return {
        ...state,
        rectify_covid_checklist: { [key]: temp },
      };
    }

    default:
      return state;
  }
};

export default checklistReducer;
