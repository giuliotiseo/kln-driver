import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { graphqlApiSlice } from "./api/graphql-api-slice";
import { restApiSlice } from './api/rest-api-slice';
import authProfileReducer from "../auth-profile/slices/authProfileSlice";
import companyReducer from "../company/slices/companySlice";

const appReducer = combineReducers({
  // v2 ->
  [graphqlApiSlice.reducerPath]: graphqlApiSlice.reducer,
  [restApiSlice.reducerPath]: restApiSlice.reducer,
  authProfile: authProfileReducer,
  company: companyReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    return appReducer(undefined, action)
  }

  return appReducer(state, action)
}

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(graphqlApiSlice.middleware)
      .concat(restApiSlice.middleware)
  },
});

// export const dispatch = store.dispatch;
export default store;
