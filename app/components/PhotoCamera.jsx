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

export default function PhotoCamera() {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const sheetRef = useRef(null);
  const cameraRef = useRef()
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const { width } = useWindowDimensions();
  const height = Math.round((width * 16) / 9);
  const url = "https://fololimo-api.vercel.app/";

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

  function stopRecording() {
    cameraRef.current.stopRecording();
    setIsRecording(false);
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
  async function recordMedia() {
    try {
      const { status } = await Camera.requestMicrophonePermissionsAsync();
      if (status !== "granted") {
        console.warn("Microphone permission not granted");
        return;
      }

      setIsRecording(true);
      let recording = await cameraRef.current.recordAsync();

      // Stop recording automatically after 5 seconds
      setTimeout(async () => {
        stopRecording();
        if (mediaLibraryPermission.granted) {
          const asset = await MediaLibrary.createAssetAsync(recording.uri);
          await MediaLibrary.createAlbumAsync("ExpoProject", asset, false);
        } else {
          console.warn("Media library permission not granted");
        }
      }, 5000); // Adjust the recording duration as needed
    } catch (error) {
      console.warn(error);
    }
  }

  function toggleCameraFacing() {
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
        <Pressable
          style={styles.captureBtn}
          onPress={() => {
            capturePhoto();
          }}
        >
          <View style={styles.capturedBtnInner} />
        </Pressable>
      </CameraView>
      <BottomSheet height='90%' ref={sheetRef}>
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
  captureBtn: {
    position: "absolute",
    left: "50%",
    width: 80,
    height: 80,
    borderWidth: 4,
    borderColor: "#fff",
    bottom: "15%",
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateX: -50 }],
  },
  capturedBtnInner: {
    width: 60,
    height: 60,
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
});
