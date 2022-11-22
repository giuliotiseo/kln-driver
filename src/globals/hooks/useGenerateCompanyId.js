import { useCallback, useEffect, useState } from "react";
import { generateCompanyId } from "../libs/generators";
import { useAuth } from "./useAuth";

// Generate companyId id hook
export default function useGenerateCompanyId() {
  const { auth } = useAuth();
  const [ companyId, setCompanyId ] = useState("");

  const generateCompanyIdCallback = useCallback(async (auth) => {
    const id = await generateCompanyId(
      auth.attributes['custom:vatNumber'],
      auth.attributes['custom:companyPlaceId'],
    );

    setCompanyId(id);
  }, []);

  useEffect(() => {
    if(auth) {
      generateCompanyIdCallback(auth);
    }
  }, [auth, generateCompanyIdCallback]);

  return companyId || null;
}