import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
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
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();

  const { width } = useWindowDimensions();
  const height = Math.round((width * 16) / 9);

  const image = useImageContext();
  if (!image) throw new Error("ImageContext not found");
  const { setImageUri } = image;

  useEffect(() => {
    (async () => {
      if (!cameraPermission) await requestCameraPermission();
      if (!mediaLibraryPermission) await requestMediaLibraryPermission();
    })();
  }, []);

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

  const capturePhoto = async () => {
    if (!cameraRef.current) return;

    setLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });

      if (photo && mediaLibraryPermission?.granted) {
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        await MediaLibrary.createAlbumAsync("ExpoProject", asset, false);
        setImageUri(photo.uri);
        router.push("/(modals)/ImageResults");
      } else {
        Alert.alert(
          "Permission Required",
          "Please enable media library access to save photos"
        );
      }
    } catch (error) {
      console.error("Photo capture failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Loading indicator while checking permission state
  if (!cameraPermission || !mediaLibraryPermission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!cameraPermission.granted) {
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
        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Pressable
            style={[styles.actionButton, loading && { opacity: 0.5 }]}
            onPress={!loading ? pickImage : undefined}
            disabled={loading}
          >
            <Entypo name="folder-images" size={24} color="black" />
          </Pressable>

          <Pressable
            style={[styles.captureButton, loading && { opacity: 0.5 }]}
            onPress={!loading ? capturePhoto : undefined}
            disabled={loading}
          >
            <View style={styles.captureButtonInner} />
          </Pressable>

          <Pressable
            style={[styles.actionButton, loading && { opacity: 0.5 }]}
            onPress={
              !loading
                ? () =>
                    setFacing((prev) => (prev === "back" ? "front" : "back"))
                : undefined
            }
            disabled={loading}
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
