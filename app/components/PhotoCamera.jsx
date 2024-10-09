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
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import BottomSheet, { BottomSheetMethods } from "@devvie/bottom-sheet";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// type Image = {
//   assetId: string | null,
//   base64: string | null,
//   duration: number | null,
//   exif: Record<string, unknown> | null,
//   fileName: string,
//   fileSize: number,
//   height: number,
//   mimeType: string,
//   rotation: number | null,
//   type: "image",
//   uri: string,
//   width: number,
// };

// type ImagePickerResult = {
//   assets: Image[],
//   canceled: boolean,
// };


export default function PhotoCamera() {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const sheetRef = useRef(null);
  const cameraRef = useRef()
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const { width } = useWindowDimensions();
  const height = Math.round((width * 16) / 9);
  const url = "https://fololimo-api.vercel.app/";

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      console.log("result", result);
    }
  };


  useEffect(() => {
    (async () => {
      if (!mediaLibraryPermission.granted) {
        const { status } = await requestMediaLibraryPermission();
        if (status !== "granted") {
          console.warn("Media library permission not granted");
        }
      }
    })();
  }, [mediaLibraryPermission]);

  if (!cameraPermission) {
    return <View />;
  }
  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestCameraPermission} title="Grant Permission" />
      </View>
    );
  }

  async function capturePhoto() {
    try {
      let photo = await cameraRef.current.takePictureAsync();
      setPreviewVisible(true);
      setCapturedImage(photo);
      console.log("photo", photo);
      if (mediaLibraryPermission.granted) {
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        console.log(asset);
        const form = new FormData();
        form.append("image", {
          uri: photo.uri,
        });
        submitImage(form);
        await MediaLibrary.createAlbumAsync("ExpoProject", asset, false);
      } else {
        console.warn("Media library permission not granted");
      }
      sheetRef.current?.open();
      
    } catch (error) {
      console.warn(error);
    }
  }

  const submitImage = async (image) => {
    try {
      const response = await fetch(
        "https://fololimo-api.vercel.app/api/v1/model/disease",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: image,
        }
      );
      console.log("response", response);
      if (response.ok) {
        const data = await response.json();
        console.log("Image uploaded successfully:", data);
      } else {
        console.warn("Image upload failed", response.statusText);
      }
    } catch (error) {
      console.warn("Error uploading image", error);
    }
  }
  
  function toggleCameraFacing() {
    console.log("toggleCameraFacing");
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={{ height, flex: 1 }}
        facing={facing}
        flash={flash}
        ratio="16:9"
        ref={cameraRef}
        autofocus="true"
      >
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

      <BottomSheet height="90%" ref={sheetRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setPreviewVisible(false);
              setCapturedImage(null);
              sheetRef.current?.close();
            }}
          >
            <Text style={styles.text}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setPreviewVisible(false);
              setCapturedImage(null);
              sheetRef.current?.close();
            }}
          >
            <Text style={styles.text}>Save</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
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
