import { Provider } from 'react-redux';
import { Amplify } from '@aws-amplify/core';
import { NavigationContainer } from '@react-navigation/native';
// Screens
import KLNDriverAppScreen from './KLNDriverAppScreen';
import awsExports from './aws-exports';
import store from './app/store';
import "./styles";

Amplify.configure(awsExports);

export default function KLNDriverApp() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <KLNDriverAppScreen component={KLNDriverAppScreen} />
        
        {/* <Stack.Navigator>
          <Stack.Screen
            name="Home"
            options={{ title: 'Home' }}
            component={KLNDriverAppScreen}
          />

          <Stack.Screen
            name="Login"
            options={{ title: 'Accedi' }}
            component={LoginScreen}
          />
        </Stack.Navigator> */}
      </NavigationContainer>
    </Provider>
  );
}