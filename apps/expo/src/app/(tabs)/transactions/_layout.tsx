import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack
      screenOptions={{ headerStyle: { backgroundColor: "rgb(20 184 166)" } }}
    >
      <Stack.Screen name="overview" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="index"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: "modal",
          headerStyle: { backgroundColor: "rgb(20 184 166)" },
          headerTitleStyle: { color: "#fff" },
          headerTitle: " Transactions History",
        }}
      />
    </Stack>
  );
};

export default _layout;
