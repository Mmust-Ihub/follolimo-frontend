import React, { useState } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "@/contexts/AuthContext";

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [error, setError] = useState(false);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext not found");
  }
  const { userToken: token } = authContext;
  // Function to pick an image from the device's gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      const data = await uploadImage(result.assets[0].uri);
      if (data) setDiseaseInfo(data);
    }
  };

  const uploadImage = async (imageUri) => {
    console.log("Uploading image...", imageUri);
    const data = new FormData();
    data.append("files", {
      uri: imageUri,
    });

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_NODEAPI_URL}/model/pest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: imageUri,
        }
      );
      const response = await res.json();
      console.log(res);
      console.log(response);

      // return response;
    } catch (error) {
      setError(true);
      console.log("Upload image failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}

      {diseaseInfo && (
        <ScrollView style={styles.infoContainer}>
          <Text style={styles.diseaseText}>{diseaseInfo.disease} disease</Text>
          <Text>Crop: {diseaseInfo.crop}</Text>

          <Text style={styles.sectionTitle}>Cause</Text>
          {diseaseInfo.cause.map((c, index) => (
            <Text key={index}>{c}</Text>
          ))}

          <Text style={styles.sectionTitle}>Environment Conditions</Text>
          {diseaseInfo.environment_conditions.map((ec, index) => (
            <Text key={index}>{ec}</Text>
          ))}

          <Text style={styles.sectionTitle}>Life Cycle</Text>
          {diseaseInfo.life_cycle.map((lc, index) => (
            <Text key={index}>{lc}</Text>
          ))}

          <Text style={styles.sectionTitle}>Nutrient Deficiency</Text>
          {diseaseInfo.nutrient_deficiency.map((nd, index) => (
            <Text key={index}>{nd}</Text>
          ))}

          <Text style={styles.sectionTitle}>Other Crops Infested</Text>
          {diseaseInfo.other_crops_infested.map((oci, index) => (
            <Text key={index}>{oci}</Text>
          ))}

          <Text style={styles.sectionTitle}>Preventive Measures</Text>
          {diseaseInfo.preventive_measures.map((pm, index) => (
            <Text key={index}>{pm}</Text>
          ))}

          <Text style={styles.sectionTitle}>Remedy</Text>
          {diseaseInfo.remedy.map((remedy, index) => (
            <Text key={index}>{remedy}</Text>
          ))}
        </ScrollView>
      )}
      {error && <Text>An error occured</Text>}
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  infoContainer: {
    marginTop: 20,
    padding: 10,
    width: "90%",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    flexGrow: 1,
  },
  diseaseText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "red",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
});
