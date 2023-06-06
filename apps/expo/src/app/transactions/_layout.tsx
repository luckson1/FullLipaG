import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack
      screenOptions={{ headerStyle: { backgroundColor: "rgb(20 184 166)" } }}
    >
      <Stack.Screen name="overview" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;
