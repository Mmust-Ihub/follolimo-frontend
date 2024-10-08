import { Text, View } from "react-native";
import PhotoCamera from "./components/PhotoCamera";
import ImgPicker from "./components/ImgPicker";
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        
      }}
    >
      {/* <PhotoCamera /> */}
      <ImgPicker />
    </View>
  );
}
