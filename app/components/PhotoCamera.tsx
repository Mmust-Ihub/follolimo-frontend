import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Button,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { useImageContext } from "@/contexts/ImageContext";
import { router } from "expo-router";

export default function PhotoCamera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<"off" | "on">("off");
  const cameraRef = useRef<CameraView>(null);
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      router.push("/(modals)/ImageResults");
    }
  };

  useEffect(() => {
    (async () => {
      if (!mediaLibraryPermission?.granted) {
        await requestMediaLibraryPermission();
      }
    })();
  }, [mediaLibraryPermission]);

  if (!cameraPermission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to use the camera
        </Text>
        <Button
          onPress={requestCameraPermission}
          title="Grant Camera Permission"
        />
      </View>
    );
  }

  const capturePhoto = async () => {
    if (cameraRef.current) {
      setLoading(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
        });

        if (mediaLibraryPermission?.granted) {
          const asset = await MediaLibrary.createAssetAsync(photo.uri);
          await MediaLibrary.createAlbumAsync("ExpoProject", asset, false);
          setImageUri(photo.uri);
          setLoading(false);
          router.push("/(modals)/ImageResults");
        } else {
          setLoading(false);
          Alert.alert(
            "Permission Required",
            "Please enable media library access to save photos"
          );
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Photo capture failed:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={{ height, flex: 1, position: "relative" }}
        facing={facing}
        flash={flash}
        ratio="1:1"
        ref={cameraRef}
        autofocus="on"
      >
        {loading && (
          <ActivityIndicator
            style={{ position: "absolute", top: "50%", left: "50%" }}
            size="large"
            color="#fff"
          />
        )}
        <View style={styles.actionContainer}>
          <Pressable style={styles.actionButton} onPress={pickImage}>
            <Entypo name="folder-images" size={24} color="black" />
          </Pressable>
          <Pressable style={styles.captureButton} onPress={capturePhoto}>
            <View style={styles.captureButtonInner} />
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
          >
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
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: "10%",
    width: "100%",
  },
  actionButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: Colors.light.tabIconSelected,
  },
  captureButton: {
    padding: 5,
    borderColor: "#fff",
    borderWidth: 3,
    borderRadius: 50,
  },
  captureButtonInner: {
    width: 65,
    height: 65,
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  message: {
    textAlign: "center",
    color: "tomato",
    paddingBottom: 10,
  },
});
