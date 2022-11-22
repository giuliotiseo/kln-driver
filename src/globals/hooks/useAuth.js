import { useContext } from "react";
import { CognitoContext } from "../libs/context";

// Get cognito user
export function useAuth() {
  return { auth: useContext(CognitoContext) };
}