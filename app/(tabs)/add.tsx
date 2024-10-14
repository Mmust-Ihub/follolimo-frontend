import {
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "@/contexts/AuthContext";

// Define types for regions, counties, and subcounties
interface Region {
  id: number;
  region: string;
}

interface County {
  id: number;
  city: string;
  region: number;
}

interface Subcounty {
  id: number;
  sub_county: string;
  city: number;
}

export default function AddFarm() {
  const authContext = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);

  if (!authContext || !themeContext) {
    throw new Error("Contexts not found");
  }

  const { userToken } = authContext;
  const { isDarkMode } = themeContext;
  const backgroundColor = isDarkMode ? Colors.dark.tint : Colors.light.tint;
  const formBackgroundColor = isDarkMode
    ? Colors.dark.background
    : Colors.light.background;
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const placeholderColor = isDarkMode ? "lightgray" : "gray";
  const tintColor = isDarkMode ? Colors.dark.tint : Colors.light.tint; // Define tint color for ripple effect and dropdown icon

  // State management
  const [regions, setRegions] = useState<Region[]>([]);
  const [counties, setCounties] = useState<County[]>([]);
  const [subcounties, setSubcounties] = useState<Subcounty[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<number | null>(null);
  const [selectedSubcounty, setSelectedSubcounty] = useState<number | null>(
    null
  );
  const [selectedSubcountyName, setSelectedSubcountyName] = useState<
    string | null
  >(null);
  const [farmName, setFarmName] = useState<string>("");
  const [farmSize, setFarmSize] = useState<number | null>(null);

  // Fetch regions
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_DJANGOAPI_URL}/fololimo/regions/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setRegions(data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchRegions();
  }, []);

  // Fetch counties based on selected region
  useEffect(() => {
    const fetchCounties = async () => {
      if (selectedRegion) {
        try {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_DJANGOAPI_URL}/fololimo/cities/?region=${selectedRegion}`
          );
          const data = await response.json();
          setCounties(data);
          setSelectedCounty(null);
          setSubcounties([]);
        } catch (error) {
          console.error("Error fetching counties:", error);
        }
      }
    };

    fetchCounties();
  }, [selectedRegion]);

  // Fetch subcounties based on selected county
  useEffect(() => {
    const fetchSubcounties = async () => {
      if (selectedCounty) {
        try {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_DJANGOAPI_URL}/fololimo/subcounties/?city=${selectedCounty}`
          );
          const data = await response.json();
          setSubcounties(data);
          setSelectedSubcounty(null);
          setSelectedSubcountyName(null);
        } catch (error) {
          console.error("Error fetching subcounties:", error);
        }
      }
    };

    fetchSubcounties();
  }, [selectedCounty]);

  const handleRegister = async () => {
    Keyboard.dismiss();
    if (!farmName || !farmSize || !selectedSubcounty) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const farmData = {
      name: farmName,
      location: selectedSubcountyName, // Use subcounty name
      size: farmSize,
    };
    var response;
    try {
      response = await fetch(
        `${process.env.EXPO_PUBLIC_DJANGOAPI_URL}/insights/farms/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(farmData),
        }
      );
      const createdFarm = await response.json();
      if (response.status === 201) {
        Alert.alert(
          "Success",
          `Farm ${createdFarm.name} registered successfully!`
        );
        // Reset fields
        setFarmName("");
        setFarmSize(null);
        setSelectedRegion(null);
        setSelectedCounty(null);
        setSelectedSubcounty(null);
        setSelectedSubcountyName(null);
      } else {
        Alert.alert("Error", "Farm registration failed. Please try again.");
      }
      console.log("response", response);
    } catch (error) {
      console.log("response", response);
      console.error("Error registering farm:", error);
      Alert.alert("Error", "An error occurred while registering the farm.");
    } finally {
      // Reset fields
      setFarmName("");
      setFarmSize(null);
      setSelectedRegion(null);
      setSelectedCounty(null);
      setSelectedSubcounty(null);
      setSelectedSubcountyName(null);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 justify-center items-center w-full"
      style={{ backgroundColor }}
    >
      {/* Header Section */}
      <View className="items-center justify-center w-full h-[100px] mb-2">
        <Text className="text-white text-2xl font-extrabold">
          Farm Registration
        </Text>
        <Text className="text-white text-base font-semibold">
          Please fill in the details
        </Text>
        <Text className="text-white text-base font-semibold">
          You may scroll down to register farm
          <AntDesign name="arrowdown" size={20} color="white" />
        </Text>
      </View>

      {/* Form Section */}
      <ScrollView
        className="flex-1 w-full px-4 rounded-t-[30px]"
        style={{ backgroundColor: formBackgroundColor }}
      >
        <KeyboardAvoidingView className="w-full gap-6 mt-6">
          {/* Name Input */}
          <View className="w-full mb-2">
            <Text className="mb-2" style={{ color: textColor }}>
              Farm Name
            </Text>
            <View className="border rounded-lg w-full flex flex-row items-center px-4 py-2 border-green-500">
              <Ionicons
                name="person-outline"
                size={20}
                color={placeholderColor}
              />
              <TextInput
                placeholder="Enter Farm name..."
                placeholderTextColor={placeholderColor}
                className="ml-2 flex-1"
                style={{ color: textColor }}
                value={farmName}
                onChangeText={setFarmName}
              />
            </View>
          </View>

          {/* Horizontal Picker Section */}
          <View className="flex-row justify-between w-full mb-2">
            {/* Region Dropdown */}
            <View className="flex-1 mr-2">
              <Text className="mb-2" style={{ color: textColor }}>
                Choose Region
              </Text>
              <View className="border rounded-lg w-full flex flex-row items-center border-green-500 overflow-hidden">
                <Picker
                  selectedValue={selectedRegion}
                  onValueChange={(itemValue) => setSelectedRegion(itemValue)}
                  style={{
                    height: 50,
                    width: "100%",
                    backgroundColor: formBackgroundColor,
                    color: textColor,
                  }}
                  itemStyle={{ color: textColor }}
                  dropdownIconColor={tintColor} // Set dropdown icon color
                  dropdownIconRippleColor={tintColor} // Set ripple effect color
                >
                  <Picker.Item label="Select a region" value={null} />
                  {regions?.map((region) => (
                    <Picker.Item
                      key={region.id}
                      label={region.region}
                      value={region.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* County Dropdown */}
            <View className="flex-1 ml-2">
              <Text className="mb-2" style={{ color: textColor }}>
                Choose County
              </Text>
              <View className="border rounded-lg w-full flex flex-row items-center border-green-500 overflow-hidden">
                <Picker
                  selectedValue={selectedCounty}
                  onValueChange={(itemValue) => setSelectedCounty(itemValue)}
                  style={{
                    height: 50,
                    width: "100%",
                    backgroundColor: formBackgroundColor,
                    color: textColor,
                  }}
                  itemStyle={{ color: textColor }}
                  dropdownIconColor={tintColor} // Set dropdown icon color
                  dropdownIconRippleColor={tintColor} // Set ripple effect color
                >
                  <Picker.Item label="Select a county" value={null} />
                  {counties?.map((county) => (
                    <Picker.Item
                      key={county.id}
                      label={county.city}
                      value={county.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Subcounty Dropdown */}
          <View className="w-full mb-2">
            <Text className="mb-2" style={{ color: textColor }}>
              Choose Subcounty
            </Text>
            <View className="border rounded-lg w-full flex flex-row items-center border-green-500 overflow-hidden">
              <Picker
                selectedValue={selectedSubcounty}
                onValueChange={(itemValue) => {
                  setSelectedSubcounty(itemValue);
                  const selected = subcounties.find(
                    (subcounty) => subcounty.id === itemValue
                  );
                  setSelectedSubcountyName(selected?.sub_county || null);
                }}
                style={{
                  height: 50,
                  width: "100%",
                  backgroundColor: formBackgroundColor,
                  color: textColor,
                }}
                itemStyle={{ color: textColor }}
                dropdownIconColor={tintColor} // Set dropdown icon color
                dropdownIconRippleColor={tintColor} // Set ripple effect color
              >
                <Picker.Item label="Select a subcounty" value={null} />
                {subcounties?.map((subcounty) => (
                  <Picker.Item
                    key={subcounty.id}
                    label={subcounty.sub_county}
                    value={subcounty.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Size Input */}
          <View className="w-full mb-2">
            <Text className="mb-2" style={{ color: textColor }}>
              Farm Size (in acres)
            </Text>
            <View className="border rounded-lg w-full flex flex-row items-center px-4 py-2 border-green-500">
              <MaterialCommunityIcons
                name="image-size-select-small"
                size={20}
                color={placeholderColor}
              />
              <TextInput
                placeholder="Enter Farm size..."
                placeholderTextColor={placeholderColor}
                className="ml-2 flex-1"
                style={{ color: textColor }}
                keyboardType="numeric"
                value={farmSize?.toString()}
                onChangeText={(text) => setFarmSize(Number(text))}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="w-full rounded-lg bg-green-500 py-3 items-center"
            onPress={handleRegister}
          >
            <Text className="text-white font-semibold text-lg">Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-full  py-3 "></TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}
