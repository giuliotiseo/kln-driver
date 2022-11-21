import { Text, View } from "react-native";
import Spinner from "./Spinner";

const PageSpinner = ({ message = "", className = ""}) => {
  return (
    <View className={`fixed flex flex-col left-0 top-0 items-center justify-center flex-1 h-screen w-screen bg-base-300 ${className}`}>
      <Spinner />
      { message && <Text className="text-lg text-center mt-2">{message}</Text>}
    </View>
  )
}

export default PageSpinner;