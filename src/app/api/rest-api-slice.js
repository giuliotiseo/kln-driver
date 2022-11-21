import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setProfileCredentials, profileLogOut } from "../../auth-profile/slices/authProfileSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://yk6gdc2iyj.execute-api.eu-central-1.amazonaws.com/master',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().authProfile.token;
    if(token) {
      headers.set("authorization", `Bearer ${token}`)
    }
    
    return headers;
  }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log("result in reauth", result);

  // Se il refresh token è scaduto occorre aggiornarlo:
  if(result?.error?.originalStatus === 403) {
    console.log('sending new refresh token')
    // send refresh token to get new access token
    const refreshResult = await baseQuery({
        url: '/refresh',
        method: 'POST',
        body: { profileId: args?.id }
    }, api, extraOptions);

    console.log('New refresh token get: ', refreshResult);

    if(refreshResult?.data) {
      console.log("Store data inside state", refreshResult);
      const profileId = api.getState().authProfile.profileId;
      const roleIds = api.getState().authProfile.roleIds;
      // Store the new token
      api.dispatch(setProfileCredentials({
        token: refreshResult.data,
        profileId,
        roleIds: roleIds,
      }));

      // retry the origina query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(profileLogOut());
    }
  }

  return result;
} 

export const restApiSlice = createApi({
  reducerPath: "rest_api",
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({})
});