import { STORE_DATABASE } from "../actions/databaseActions";

const initialState = {
  current_institution: "cgh",
  audit_forms: null,
  audits: null,
  institutions: null,
  staffs: null,
  tenants: null,
};

export const databaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_DATABASE:
      const institutions = action.database.institutions;
      delete institutions["default"];
      const tenants = action.database.tenants;
      delete tenants["default"];
      console.log(tenants);
      return {
        ...state,
        audit_forms: action.database.audit_forms,
        audits: action.database.audits,
        institutions: institutions,
        staffs: action.database.staffs,
        tenants: tenants,
      };
    default:
      return state;
  }
};
