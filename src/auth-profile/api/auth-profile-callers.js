import { portableGraphqlQuery } from "../../app/api/graphql-api-slice";
import { CREATE_PROFILE, DELETE_PROFILE, UPDATE_PROFILE } from "./graphql/mutations";
import { LIST_PROFILES } from "./graphql/queries";
import { addProfileToCompanyFormatter, removeProfileFromCompanyFormatter, updateProfileInCompanyFormatter } from "./auth-profile-params-formatters";

// Get --------------------------------------------------------------------------------------------------------------------------------
export const getAuthProfilesCaller = () => ({
  body: LIST_PROFILES
});

// Create --------------------------------------------------------------------------------------------------------------------------------
export const addProfileToCompanyCaller =  async (params) => {
  const dataToReturn = addProfileToCompanyFormatter(params);
  const result = await portableGraphqlQuery({
    body: CREATE_PROFILE,
    args: dataToReturn
  });
  
  return result;
};

// Update --------------------------------------------------------------------------------------------------------------------------------
export const updateProfileInCompanyCaller = (params) => ({
  body: UPDATE_PROFILE,
  args: updateProfileInCompanyFormatter(params)
})

// Delete --------------------------------------------------------------------------------------------------------------------------------
export const removeProfileFromCompanyCaller = (params) => ({
  body: DELETE_PROFILE,
  args: removeProfileFromCompanyFormatter(params)
})