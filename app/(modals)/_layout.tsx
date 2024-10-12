import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router/stack'

export default function modals() {
  return (
    <Stack screenOptions={{presentation: "modal"}}>
      <Stack.Screen
        name="ImageResults"
        options={{
          title: "Image Results",
        }}
      />
      <Stack.Screen
        name="Chat"
        options={{
          title: "Chat with Dr. Shamba",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}