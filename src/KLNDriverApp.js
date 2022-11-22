import { useState, useEffect, useCallback } from 'react';
import useSignOut from './auth-user/hooks/useSignOut';
import { Provider } from 'react-redux';
import { Amplify } from '@aws-amplify/core';
import { Auth, Hub } from 'aws-amplify';
import { NavigationContainer } from '@react-navigation/native';
import PageSpinner from './globals/components/layout/PageSpinner';
import HomeScreen from './dashboard/screens/HomeScreen';
import LoginScreen from './auth-user/screens/LoginScreen';
import { CognitoContext } from './globals/libs/context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import awsExports from './aws-exports';
import store from './app/store';
import "./styles";

Amplify.configure(awsExports);
const Stack = createNativeStackNavigator();

export default function KLNDriverApp() {
  const [ loading, setLoading ] = useState(true);
  const [ userFromCognito, setUserFromCognito ] = useState(null);
  const [ isSignedIn, setIsSignedId ] = useState(false);
  const { signOut } = useSignOut();  

  // Get logged user info async wrapper
  const getAuthenticatedUser = useCallback(() => {
    Auth.currentAuthenticatedUser().then(async (authUser) => {
      if (authUser?.username) {
        setLoading(true);
        setUserFromCognito(authUser);
        setLoading(false);
      } else {
        setLoading(false);
        setUserFromCognito(null);
        console.log('Exit protocol - user initialization failed');
        signOut();
      }
    }).catch(error => {
      // Auth treats 'not authenticated' as an error
      if (error !== 'not authenticated') {
        console.log('getAuthenticatedUser error:', error);
        setLoading(false);
        signOut();
      }
    });
  }, [signOut]);

  
  // Amplify auth events listener
  const authListener = useCallback(async (data) => {
    console.log('authListener: event:', data.payload.event);
    switch (data.payload.event) {
      case 'signIn':
        setLoading(true);
        getAuthenticatedUser();
        setIsSignedId(true);
        break;
      case 'signOut':
        // Reset cognito data
        setLoading(false);
        setUserFromCognito(null);
        console.log('User signed out');
        setIsSignedId(false);
        break;
      default:
        return null
    }
  }, [getAuthenticatedUser]);

  
  useEffect(() => {
    if(!userFromCognito) {
      // Capisco se sono loggato o no
      getAuthenticatedUser();
    }
    // Set Amplify auth events listener
    const authListenerHub = Hub.listen('auth', authListener);    
    return () => authListenerHub();
  }, [userFromCognito, authListener, getAuthenticatedUser]);

  if(loading) return <PageSpinner />;

  return (
    <Provider store={store}>
      <CognitoContext.Provider value={userFromCognito}>
        <NavigationContainer>
          <Stack.Navigator>
            { !isSignedIn 
              ? <Stack.Screen 
                  name="Accedi"
                  component={LoginScreen}
                  options={{ headerShown: false }}  
                /> 
              : <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                />
            }
          </Stack.Navigator>
        </NavigationContainer>
      </CognitoContext.Provider>
    </Provider>
  );
}