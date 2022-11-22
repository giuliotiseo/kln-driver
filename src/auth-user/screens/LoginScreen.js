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

  if(isLoading) return <PageSpinner message="Accesso in corso" className="z-50 opacity-95" />

  return (
    <View className="flex flex-col items-center justify-center w-full h-full p-4 bg-light-200">
      {/* KLN Intestazioni */}
      <View className="flex flex-col mb-8 w-full">
        <Text className="text-4xl text-left font-bold text-dark-100 dark:text-light-300">
          Accedi
        </Text>
        <Text className="text-left mt-2 text-dark-100 dark:text-light-300 text-lg">
          Inserisci i tuoi dati per continuare
        </Text>
      </View>
      
      <View className="w-full">
        <InputEmail
          id="login-username"
          label="Inserisci username o email"
          style="flex-col w-full"
          contentClassName="w-full text-lg"
          labelClassName="block mb-2 text-left w-full text-gray-400 dark:text-gray-600"
          inputClassName="text-xl p-3"
          onBlurCallback={true}
          callback={({ value }) => setUsername(value)}
          returnKeyType="next"
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
          labelClassName="block mb-2 text-left w-full text-gray-400 dark:text-gray-600"
          onBlurCallback={true}
          secureTextEntry={true}
          placeholder="******"
          value={password}
          callback={({ value }) => setPassword(value)}
          returnKeyType="next"
          disabled={isLoading}
        />
      </View>

      {/* KLN Intestazioni */}
      <View className="mt-4 w-full">
        <DefaultButton
          text="Accedi"
          style="mt-4 inline-block p-4 ml-auto"
          textClassName="font-bold uppercase block self-end"
          inputClassName="text-xl"
          loading={isLoading}
          loadingText="Accesso in corso"
          onPress={() => signIn(username, password)}
        />
      </View>
    </View>
  )
}