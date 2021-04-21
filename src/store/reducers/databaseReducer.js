import {
  GET_RELEVANT_TENANTS,
  GET_ACTIVE_AUDITS,
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

const databaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INSTITUTIONS:
      return {
        ...state,
        institutions: action.institutions,
      };

    case GET_RELEVANT_TENANTS:
      return {
        ...state,
        relevantTenants: action.relevantTenants,
      };

    case GET_ACTIVE_AUDITS:
      return {
        ...state,
        activeAudits: action.activeAudits,
      };

    case STORE_GRAPH_DATA:
      return {
        ...state,
        graphData: { ...action.graphData },
      };

    case GET_NOTIFICATIONS: {
      const read = action.notifications.filter(
        (notification) => notification.readReceipt
      );
      const unread = action.notifications.filter(
        (notification) => !notification.readReceipt
      );
      return {
        ...state,
        notifications: { read, unread },
      };
    }

    case CLEAR:
      return initialState;

    default:
      return state;
  }
};

export default databaseReducer;
