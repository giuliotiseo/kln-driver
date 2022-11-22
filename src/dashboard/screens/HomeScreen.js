// Dependencies
import { Hub } from "aws-amplify";
// Hooks
import { useCallback, useEffect, useState } from 'react';
// Components
import { Text, View } from 'react-native'
import { useDispatch } from 'react-redux';
import { useGetCompany } from '../../company/hooks/useGetCompany';
// Helpers
import { profileLogOut } from "../../auth-profile/slices/authProfileSlice";
import { useGetAuthProfilesQuery } from "../../auth-profile/api/auth-profile-api-slice";
import PageSpinner from "../../globals/components/layout/PageSpinner";

function HomeScreen() {
  const [ loading, setLoading ] = useState(true);
  const [ signOutLoading, setSignOutLoading ] = useState(false);
  const { company, isLoading: isLoadingCompany } = useGetCompany();
  const { data: profiles, isLoading: isLoadingProfiles } = useGetAuthProfilesQuery();
  const dispatch = useDispatch();

  // Restart from root on first load
  useEffect(() => {
    if(company && profiles) {
      setLoading(false);
    };
  }, [company, profiles]);

  // Amplify auth events listener for cleanup store in case of logout
  const authListener = useCallback(async (data) => {
    console.log('APP authListener:', data.payload.event);
    switch (data.payload.event) {
      case 'signOut':
        setSignOutLoading(true);
        // Clear store
        dispatch(profileLogOut());
        dispatch({ type: 'USER_LOGOUT' });
        break;
        default:
          return null
    }
  }, [dispatch]);
        
  // Listener for logout action
  useEffect(() => {
    // Set Amplify auth events listener
    const logoutListenerHub = Hub.listen('auth', authListener);    
    // Clean up subscriptions and store on dispose
    return () => logoutListenerHub();
  }, [dispatch, authListener]);

  // Waiting render
  if(loading || !company || !profiles || isLoadingCompany || isLoadingProfiles) {
    return <PageSpinner />
  }

  return (
    <View>
      <Text>
        Qui il router per la PrivateApp
      </Text>

      {/* <View className="mt-4 w-full">
        <DefaultButton
          text="Logout"
          style="mt-4 inline-block p-4 ml-auto"
          textClassName="font-bold uppercase block self-end"
          inputClassName="text-xl"
          loading={isLoading}
          loadingText="Sto uscendo"
          onPress={signOut}
        />
      </View> */}
    </View>
  )
}

export default HomeScreen;
