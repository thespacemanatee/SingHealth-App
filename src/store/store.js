import ReduxThunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware } from "redux";

import databaseReducer from "./reducers/databaseReducer";
import checklistReducer from "./reducers/checklistReducer";
import authReducer from "./reducers/authReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  database: databaseReducer,
  checklist: checklistReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default store;
