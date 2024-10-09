import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router/stack'

export default function modals() {
  return (
    <Stack >
      <Stack.Screen
        name="ImageResults"
        options={{
          presentation: "modal",
          title: "Image Results",
        }}
      />
    </Stack>
  );
}