import { STORE_DATABASE } from "../actions/databaseActions";

const initialState = {
  current_institution: "cgh",
  audits: null,
  institutions: null,
  staffs: null,
  tenants: null,
};

const databaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_DATABASE:
      return {
        ...state,
        audits: action.database.audits,
        institutions: action.database.institutions,
        staffs: action.database.staffs,
        tenants: action.database.tenants,
      };
    default:
      return state;
  }
};

export default databaseReducer;
