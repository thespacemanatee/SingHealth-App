import {
  GET_RELEVANT_TENANTS,
  GET_TENANT_ACTIVE_AUDITS,
  GET_STAFF_ACTIVE_AUDITS,
} from "../actions/databaseActions";

const initialState = {
  relevantTenants: [],
  activeAudits: [],
};

const equals = (a, b) => {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();
  if (!a || !b || (typeof a !== "object" && typeof b !== "object"))
    return a === b;
  if (a.prototype !== b.prototype) return false;
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((k) => equals(a[k], b[k]));
};

const databaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RELEVANT_TENANTS: {
      if (equals(state.relevantTenants, action.relevantTenants)) {
        return state;
      }
      return {
        ...state,
        relevantTenants: action.relevantTenants,
      };
    }
    case GET_TENANT_ACTIVE_AUDITS: {
      if (equals(state.activeAudits, action.activeAudits)) {
        return state;
      }
      return {
        ...state,
        activeAudits: action.activeAudits,
      };
    }
    case GET_STAFF_ACTIVE_AUDITS: {
      if (equals(state.activeAudits, action.activeAudits)) {
        console.log("Equal");
        return state;
      }
      console.log("Not equal");
      return {
        ...state,
        activeAudits: action.activeAudits,
      };
    }
    default:
      return state;
  }
};

export default databaseReducer;
