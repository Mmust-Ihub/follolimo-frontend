import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";


const Layout = () => {
  const { id, farmName } = useLocalSearchParams();
  const farmNameString = Array.isArray(farmName) ? farmName[0] : farmName;

  return (
    <Stack screenOptions={{ title: farmNameString }}>
      <Stack.Screen name="index"  options={{
                  headerTitle: "My Farms",
                  headerTitleAlign: "center",
                }} /> 
      <Stack.Screen name="[farmdet]" options={{animation: "flip"}} />
    </Stack>
  );
};

export default Layout;
