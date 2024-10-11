import { CameraView, useCameraPermissions, Camera } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useImageContext } from "@/contexts/ImageContext";
import { router } from "expo-router";



export default function PhotoCamera() {
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const cameraRef = useRef();
  const [loading, setLoading] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();
  const { width } = useWindowDimensions();
  const height = Math.round((width * 16) / 9);
  const image = useImageContext();
  if (!image) {
    throw new Error("ImageContext not found");
  }
  const { setImageUri } = image;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      setImageUri(result.assets[0].uri);
      console.log("result", result.assets[0]);
      router.push("/(modals)/ImageResults");
    }
  };

  useEffect(() => {
    (async () => {
      if (!mediaLibraryPermission.granted) {
        const { status } = await requestMediaLibraryPermission();
        if (status !== "granted" | null) {
          requestCameraPermission();
          console.warn("Media library permission not granted");
          router.push("/(tabs)")
        }
      }
    })();
  }, [mediaLibraryPermission]);

  

  async function capturePhoto() {
    setLoading(true);
    try {
      let photo = await cameraRef.current.takePictureAsync({ shutterSound : false });
      console.log("photo", photo);
      if (mediaLibraryPermission.granted) {
        
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        console.log("asset...",asset);
        await MediaLibrary.createAlbumAsync("ExpoProject", asset, false);
        setImageUri(photo.uri);
        router.push("/(modals)/ImageResults");
      } else {
        console.warn("Media library permission not granted");
        Alert.alert("Permission required", "Please allow media library permission to save photos", [
          {
            text: "OK",
            onPress: () => {
              requestMediaLibraryPermission();
            },
          },
        ]);

      }
    } catch (error) {
      console.warn("My bad",error);
    }finally{
      setLoading(false);
    }

  }

  function toggleCameraFacing() {
    console.log("toggleCameraFacing");
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={{ height, flex: 1, position: "relative" }}
        facing={facing}
        flash={flash}
        ratio="16:9"
        ref={cameraRef}
        autofocus="true"
      >
        {loading && <ActivityIndicator style={{position: "absolute", top: '50%', left: '50%'}} size="large" color="#fff" />}
        <View className="absolute flex-row justify-between px-[20%] items-center bottom-[10%] w-screen">
          <Pressable style={styles.ActionButtons} onPress={pickImage}>
            <Entypo name="folder-images" size={24} color="black" />
          </Pressable>
          <Pressable
            style={styles.captureBtn}
            onPress={() => {
              capturePhoto();
            }}
          >
            <View style={styles.capturedBtnInner} />
          </Pressable>
          <Pressable style={styles.ActionButtons} onPress={toggleCameraFacing}>
            <MaterialCommunityIcons
              name="camera-flip"
              size={24}
              color="black"
            />
          </Pressable>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  ActionButtons: {
    padding: 2,
    borderRadius: 50,
    backgroundColor: Colors.light.tabIconSelected,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  capturedBtnInner: {
    width: 65,
    height: 65,
    borderRadius: 50,
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  buttonContainer: {
    width: "auto",
    flexDirection: "row",
    backgroundColor: "#fff",
    marginTop: 64,
    margin: 10,
    padding: 10,
    borderRadius: 30,
    top: "125%",
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  captureBtn: {
    borderRadius: 50,
    padding: 4,
    borderColor: "#fff",
    borderWidth: 3,
  },
});
