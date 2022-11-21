import { useState } from "react";
import useSignIn from "../hooks/useSignIn";
import PageSpinner from "../../globals/components/layout/PageSpinner";
import { Text, View } from "react-native";
import InputEmail from "../../globals/components/dataEntry/InputEmail";
import DefaultButton from "../../globals/components/buttons/DefaultButton";
import InputPassword from "../../globals/components/dataEntry/InputPassword";

export default function LoginScreen() {
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [{ isLoading }, signIn ] = useSignIn();

  return (
    <View className="flex flex-col items-center justify-center w-full p-4">
      { isLoading && <PageSpinner message="Accesso in corso" className="z-50 opacity-95" /> }

      {/* KLN Intestazioni */}
      <View className="flex flex-col mb-8">
        <View className="flex items-center mb-4">
          <Text className="text-4xl font-bold text-dark-100 dark:text-light-300">
            KLN
          </Text>
        </View>

        <Text className="text-center font-bold text-xl text-dark-100 dark:text-light-300">Ti diamo il benvenuto su LTS Driver</Text>
        <Text className="text-center mt-2 text-dark-100 dark:text-light-300 text-lg">
          Ricevi incarichi di trasporto e gestisci le operazioni di carico e scarico
        </Text>
      </View>
      
      <View className="w-full">
        <InputEmail
          id="login-username"
          label="Inserisci username o email"
          style="flex-col w-full"
          contentClassName="w-full text-lg"
          labelClassName="block mb-2 text-gray-400 dark:text-gray-600"
          inputClassName="text-xl p-3"
          onBlurCallback={true}
          callback={({ value }) => setUsername(value)}
          value={username}
          showButton={false}
          disabled={isLoading}
        />

        <InputPassword
          id="login-pssw"
          label="Inserisci password"
          style="flex-col w-full mt-4"
          contentClassName="w-full"
          inputClassName="text-xl p-3"
          labelClassName="block mb-2 text-gray-400 dark:text-gray-600"
          onBlurCallback={true}
          secureTextEntry={true}
          value={password}
          callback={({ value }) => setPassword(value)}
          disabled={isLoading}
        />
      </View>

      {/* KLN Intestazioni */}
      <View className="w-full mt-4">
        <DefaultButton
          text="Accedi"
          style="mt-4 w-full block p-4"
          textClassName="block w-full font-bold uppercase block"
          inputClassName="text-xl"
          loading={isLoading}
          loadingText="Accesso in corso"
          onPress={() => signIn(username, password)}
        />
      </View>


      {/* <SignInForm
        isLoading={isLoading}
        callback={signIn}
      /> */}
    </View>
  )
}