import { portableGraphqlQuery } from "../../app/api/graphql-api-slice";
import { GET_COMPANY } from "./graphql/queries";
import { getBasicCompanyFormatter } from "./company-params-formatters";

// Get --------------------------------------------------------------------------------------------------------------------------------
export const getBasicCompanyCaller = async (params) => {
  const result = await portableGraphqlQuery({
    body: GET_COMPANY,
    args: getBasicCompanyFormatter(params)
  });

  return result?.data;
};