import { Auth } from "aws-amplify";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// Login -----------------------------------------------------------------------------------------------------------
export default function useSignIn() {
  const [ loading, setLoading ] = useState(false);
  const [ user, setUser ] = useState(null);
  // const navigate = useNavigate();

  async function handleSignIn (inputUsername, inputPassword) {
    setLoading(true);

    if(!inputUsername) {
      // toast.error("Inserisci email");
      setLoading(false);
      throw Error("Missing email");
    }

    if(!inputPassword) {
      // toast.error("Inserisci password");
      setLoading(false);
      throw Error("Missing password");
    }

    const username = inputUsername;
    const password = inputPassword;

    if(username && password) {
      try {
      // Amplify Hub will intercept the 'signin' event and log the user in
      await Auth
        .signIn(username, password)
        .then(user => {
          if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            console.log("NEW_PASSWORD_REQUIRED")
            // toast.info('È richiesta una nuova password');
            setUser(user);
            // navigate('/restore-password', {
            //   state: { username: username, tempPassword: password }
            // });
          } else {
            console.log("Cambio root");
            // navigate('/', { state: user });
          }
        });
      } catch(error) {
        if (error.code === 'UserNotConfirmedException') {
          console.log("UserNotConfirmedException")
          // navigate("/authcode", {
          //   state: { username: username }
          // });
        } else if (error.code === 'NotAuthorizedException') {
          console.log("NotAuthorizedException")
          // toast.error('Errore, ricontrolla i dati inseriti')
        } else {
          console.log(`Errore: ${error.message}`)
          // toast.error(`Errore: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
  }

  return [
    { user, isLoading: loading, },
    handleSignIn
  ]
}