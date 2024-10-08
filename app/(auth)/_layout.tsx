
import { Stack } from "expo-router/stack";
import React from 'react'

const auth = () => {
    function Home() {
        return (
          <Stack>
            <Stack.Screen name="index" options={{title: "login"}} />
            <Stack.Screen name="SignUp" options={{}} />
          </Stack>
        );
    }
}

export default auth