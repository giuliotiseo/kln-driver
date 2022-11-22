import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { graphqlApiSlice } from "../../app/api/graphql-api-slice";
import { getBasicCompanyCaller } from "./company-callers";

const companyAdapter = createEntityAdapter();
const initialState = companyAdapter.getInitialState();

export const extendedCompanyApiSlice = graphqlApiSlice.injectEndpoints({
  endpoints: builder => ({
    getCompany: builder.query({
      async queryFn(id) {
        if(!id) return { data: null };
        const response = await getBasicCompanyCaller(id);
        return { data: companyAdapter.addOne(initialState, response) };
      },
      providesTags: (result) => {
        if(!result?.ids?.length) return [];
        return [
        ...result.ids.map(id => ({ type: 'Company', id }))
        ]
      }
    }),
  })
})

export const {
  useGetCompanyQuery
} = extendedCompanyApiSlice;

// return the query result object
export const selectCompanyResult = extendedCompanyApiSlice.endpoints.getCompany.select();

// creates memoized selector
const selectCompanyData = createSelector(
  selectCompanyResult,
  companyResult => companyResult.data
);

export const {
  selectAll: selectAllCompany,
  selectById: selectCompanyById
  // selectIds: returns the state.ids array.
  // selectEntities: returns the state.entities lookup table.
  // selectAll: maps over the state.ids array, and returns an array of entities in the same order.
  // selectTotal: returns the total number of entities being stored in this state.
  // selectById: given the state and an entity ID, returns the entity with that ID or undefined.
} = companyAdapter.getSelectors(state => selectCompanyData(state) ?? initialState);

