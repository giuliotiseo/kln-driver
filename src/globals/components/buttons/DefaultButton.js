import { Pressable, Text, View } from "react-native";

export default function DefaultButton({
  onPress,
  loading,
  disabled = false,
  text,
  loadingText,
  icon,
  style = "",
  textClassName = "",
}) {
  return (
    <Pressable
      disabled={disabled || loading}
      className={`relative flex py-2 px-3 items-center rounded-md outline-none disabled:opacity-20 bg-primary-200 text-light-300 hover:bg-primary-100 border-2 border-primary-200 ${style}`}
      onPress={onPress}
    >
    <View className="flex items-center">
      { icon && ( <Text> { icon }  </Text> )}
      <Text className={`text-light-300 ${textClassName}`}>
        {loading ? loadingText : text}
      </Text>
    </View>
    </Pressable>

  )
}