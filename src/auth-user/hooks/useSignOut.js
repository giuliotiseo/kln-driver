import { Auth } from "aws-amplify";
import { useState } from "react";

// Sign out -----------------------------------------------------------------------------------------------------------
export default function useSignOut() {
  const [ loading, setLoading ] = useState(false);
  const signOut = () => {
    setLoading(true);

    // TODO: Try per effettuare prima il logout dal profilo e poi passa a quello da cognito

    try {
      setLoading(true);
      Auth.signOut();
    } catch(err) {
      console.error(err);
      setLoading(false);
    }
  }

  return { isLoading: loading, signOut}
}