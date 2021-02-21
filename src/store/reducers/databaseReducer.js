import { STORE_DATABASE } from "../actions/databaseActions";

const initialState = {
  current_institution: "cgh",
  audit_forms: [],
  audits: [],
  institutions: [],
  staffs: [],
  tenants: [],
};

export const databaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_DATABASE:
      console.log(action.database.audits);
      return {
        ...state,
        audit_forms: action.database.audit_forms,
        audits: action.database.audits,
        institutions: action.database.institutions,
        staffs: action.database.staffs,
        tenants: action.database.tenants,
      };
    default:
      return state;
  }
};
