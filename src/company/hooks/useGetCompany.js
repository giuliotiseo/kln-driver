import { useEffect } from "react";
import { useSelector, useDispatch  } from "react-redux";
import { useGetCompanyQuery } from "../api/company-api-slice";
import useGenerateCompanyId from "../../globals/hooks/useGenerateCompanyId";
import { selectCurrentCompany, setCurrentCompany } from "../slices/companySlice";

export const useGetCompany = () => {
  const companyId = useGenerateCompanyId();
  const { data, isLoading, isSuccess, isError, error } = useGetCompanyQuery(companyId);
  const dispatch = useDispatch();
  const company = useSelector(selectCurrentCompany);

  useEffect(() => {
    if(data?.ids?.length > 0 ){
      dispatch(setCurrentCompany(data.entities[data.ids[0]]));
    }
  }, [data]);

  return {
    company,
    profiles: company?.profiles?.items?.length > 0 
      ? company.profiles.items.map(profile => profile)
      : [],
    isLoading,
    isSuccess,
    isError,
    error
  }
}