
import React from 'react'
import { Stack } from 'expo-router'

const Layout = () => {
  return (
      <Stack screenOptions={{
          headerShadowVisible: false,
      }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='Calendar' />
    </Stack>
  )
}

export default Layout