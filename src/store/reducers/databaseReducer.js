import {
  GET_RELEVANT_TENANTS,
  GET_TENANT_ACTIVE_AUDITS,
  GET_STAFF_ACTIVE_AUDITS,
  GET_INSTITUTIONS,
  STORE_GRAPH_DATA,
  GET_NOTIFICATIONS,
  CLEAR,
} from "../actions/databaseActions";

const initialState = {
  institutions: [],
  relevantTenants: [],
  activeAudits: [],
  graphData: {},
  notifications: [],
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
    case GET_RELEVANT_TENANTS:
      if (equals(state.institutions, action.institutions)) {
        return state;
      }
      return {
        ...state,
        institutions: action.institutions,
      };

    case GET_INSTITUTIONS:
      if (equals(state.relevantTenants, action.relevantTenants)) {
        return state;
      }
      return {
        ...state,
        relevantTenants: action.relevantTenants,
      };

    case GET_TENANT_ACTIVE_AUDITS:
      if (equals(state.activeAudits, action.activeAudits)) {
        return state;
      }
      return {
        ...state,
        activeAudits: action.activeAudits,
      };

    case GET_STAFF_ACTIVE_AUDITS:
      if (equals(state.activeAudits, action.activeAudits)) {
        return state;
      }
      return {
        ...state,
        activeAudits: action.activeAudits,
      };

    case STORE_GRAPH_DATA:
      return {
        ...state,
        graphData: { ...action.graphData },
      };

    case GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.notifications,
      };

    case CLEAR:
      return initialState;

    default:
      return state;
  }
};

export default databaseReducer;
