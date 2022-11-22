import { Text, TextInput, View } from "react-native";
import { v4 } from "uuid";

// Main component -------------------------------------------------------------------------------------------------------------------
export default function InputEmail({
  id = v4(),
  label = null,
  placeholder="es: mario.rossi@lts.it",
  style = "",
  labelClassName="",
  loading,
  contentClassName = "",
  inputClassName = "",
  disabled = false,
  value,
  callback = (value) => console.log('Conferma testo <InputEmail />', value),
  isError = false,
}){
  return (
    <View className={`w-full flex items-center ${style}`}>
      { label && <Text htmlFor={id} className={`label ${labelClassName}`}>{label}</Text> }
      <View className={`w-full flex items-center ${contentClassName}`}>
        <View className={`flex items-center w-full`}>
          <TextInput
            id={id}
            value={value}
            type="email"
            autoComplete="email"
            disabled={disabled}
            onChangeText={(value) => !loading && callback({ value, name: id, type: "email" })}
            className={`w-full outline-none border bg-light-200 dark:bg-dark-200 border-light-50 dark:border-dark-100 focus:border-cyan-500 dark:focus:border-cyan-500 text-dark-100 dark:text-light-300 px-2 py-4 rounded-md disabled:bg-light-100 dark:disabled:bg-dark-100 disabled:cursor-not-allowed disabled:opacity-50 ${isError && 'input--error'} ${disabled && 'input--disabled'} outline-none ${inputClassName}`}
            placeholder={placeholder}
          />
        </View>
      </View>
    </View>
  )
}