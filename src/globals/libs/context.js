import { createContext } from 'react';

// Context value to pass down the cognito user response
export const CognitoContext = createContext();
CognitoContext.displayName = 'UserContext';