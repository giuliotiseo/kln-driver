import { Text, TextInput, View } from "react-native";
import { v4 } from "uuid";

// Main components -------------------------------------------------------------------------------------------------------------------
export default function InputPassword({
  id = v4(),
  label = null,
  placeholder = "",
  style = "",
  labelClassName="",
  loading,
  contentClassName = "",
  inputClassName = "",
  returnKeyType="done",
  disabled = false,
  value,
  callback = (payload) => console.log('Conferma testo <InputPassword />', payload),
  isError = false,
}){
  return (
    <View className={`flex items-center ${style}`}>
      { label && <Text htmlFor={id} className={`label ${labelClassName}`}>{label}</Text> }
      <View className={`flex items-center ${contentClassName}`}>
        <View className={`flex items-center w-full`}>
          <TextInput
            id={id}
            type="text"
            secureTextEntry={true}
            disabled={disabled}
            value={value}
            returnKeyType={returnKeyType}
            className={`outline-none border bg-light-200 dark:bg-dark-200 border-light-50 dark:border-dark-100 focus:border-cyan-500 dark:focus:border-cyan-500 text-dark-100 dark:text-light-300 rounded-md disabled:bg-light-100 dark:disabled:bg-dark-100 disabled:cursor-not-allowed disabled:opacity-50 w-full ${inputClassName} ${isError && 'input--error'} outline-none ${loading && 'pointer-events-none'}`}
            placeholder={placeholder}
            onChangeText={(value) => !loading && callback({ value, name: id, type: "password" })}
          />
        </View>
      </View>
    </View>
  )
}