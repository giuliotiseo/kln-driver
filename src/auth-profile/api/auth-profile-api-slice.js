import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { getAuthProfilesCaller, addProfileToCompanyCaller, removeProfileFromCompanyCaller, updateProfileInCompanyCaller } from "./auth-profile-callers";
//import { toast } from "react-toastify";
import { graphqlApiSlice } from "../../app/api/graphql-api-slice";
import { restApiSlice } from "../../app/api/rest-api-slice";

// Rest connection -----------------------------------------------------------------------------------------------------------------------
export const authProfileApiSlice = restApiSlice.injectEndpoints({
  endpoints: builder => ({
    loginProfile: builder.mutation({
      query: credentials => ({
        url: '/auth',
        method: 'POST',
        body: { ...credentials }
      })
    }),
    refreshToken: builder.mutation({
      query: credentials => ({
        url: '/refresh',
        method: 'POST',
        body: { ...credentials }
      })
    }),
    logoutProfile: builder.mutation({
      query: credentials => ({
        url: '/logout',
        method: 'POST',  
        body: { ...credentials }
      })
    }),
    updateNewPassword: builder.mutation({
      query: credentials => ({
        url: '/update',
        method: 'POST',  
        body: { ...credentials }
      })
    }),
    registerProfile: builder.mutation({
      query: profileData => ({
        url: '/register',
        method: 'POST',  
        body: { ...profileData }
      })
    }),
  })
});

export const {
  useLoginProfileMutation,
  useRefreshTokenMutation,
  useLogoutProfileMutation,
  useUpdateNewPasswordMutation,
  useRegisterProfileMutation,
} = authProfileApiSlice;

// Graphql connection -----------------------------------------------------------------------------------------------------------------------
const authProfileAdapter = createEntityAdapter();
const initialState = authProfileAdapter.getInitialState();
export const extendedAuthProfileApiSlice = graphqlApiSlice.injectEndpoints({
  endpoints: builder => ({
    getAuthProfiles: builder.query({
      query: () => getAuthProfilesCaller(),
      transformResponse: response => authProfileAdapter.setAll(initialState, response.items),
      providesTags: (result) => {
        if(!result?.ids?.length) return [];
        return [
          ...result.ids.map(id => ({ type: 'Profile', id })),
          { type: 'Profile', id: 'LIST' }
        ]
      }
    }),
    // Mutations
    addProfileToCompany: builder.mutation({
      async queryFn(args) {
        if(!args) return { data: null };
        const response = await addProfileToCompanyCaller({
          ...args,
          searchable: `${args.name.toLowerCase()} ${args.surname.toLowerCase()}`,
          username: args.email,
        });
        console.log("Res", response);
        // if(!response?.error) toast.success(`${args.name} è stato aggiunto ai profili aziendali`);
        return response
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          extendedAuthProfileApiSlice.util.updateQueryData('getAuthProfiles', undefined, (draft) => {
            authProfileAdapter.addOne(draft, {
              ...args,
              username: args?.email,
              searchable: `${args.name.toLowerCase()} ${args.surname.toLowerCase()}`
            })
          })
        )

        try {
          await queryFulfilled;
        } catch(err) {
          console.error(err);
            // toast.error(`Non è stato possibile aggiungere ${args.name} all'elenco dei profili aziendali`);
          patchResult.undo();
        }
      }
    }),
    updateProfileInCompany: builder.mutation({
      query: (params) => updateProfileInCompanyCaller(params),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          extendedAuthProfileApiSlice.util.updateQueryData('getAuthProfiles', undefined, (draft) => {
            authProfileAdapter.updateOne(draft, ({
              id: args.id,
              changes: {
                name: args.name,
                surname: args.surname,
                searchable: `${args.name.toLowerCase()} ${args.surname.toLowerCase()}`,
                fiscalCode: args.fiscalCode,
                phone: args.phone,
                roleIds: args.roleIds,
                username: args.email,
                email: args.email, 
              }
            }))
          })
        )

        try {
          await queryFulfilled;
        } catch(err) {
          console.error(err);
          // toast.error(`Si è verificato un problema durante l'aggiornamento del profilo`);
          patchResult.undo();
        }
      }
    }),
    removeProfileFromCompany: builder.mutation({
      query: (params) => removeProfileFromCompanyCaller(params),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          extendedAuthProfileApiSlice.util.updateQueryData('getAuthProfiles', undefined, (draft) => {
            authProfileAdapter.removeOne(draft, args.id)
          })
        )

        try {
          await queryFulfilled;
        } catch(err) {
          console.error(err);
          // toast.error(`Si è verificato un problema durante la rimozione del profilo`);
          patchResult.undo();
        }
      }
    }),
  })
})

export const {
  useGetAuthProfilesQuery,
  useAddProfileToCompanyMutation,
  useRemoveProfileFromCompanyMutation,
  useUpdateProfileInCompanyMutation,
} = extendedAuthProfileApiSlice;

// return the query result object
export const selectAuthProfilesResult = extendedAuthProfileApiSlice.endpoints.getAuthProfiles.select();

// creates memoized selector
const selectAuthProfileData = createSelector(
  selectAuthProfilesResult,
  authProfilesResult => authProfilesResult.data
);

export const {
  selectAll: selectAllProfiles,
  selectById: selectProfileById
  // selectIds: returns the state.ids array.
  // selectEntities: returns the state.entities lookup table.
  // selectAll: maps over the state.ids array, and returns an array of entities in the same order.
  // selectTotal: returns the total number of entities being stored in this state.
  // selectById: given the state and an entity ID, returns the entity with that ID or undefined.
} = authProfileAdapter.getSelectors(state => selectAuthProfileData(state) ?? initialState);

