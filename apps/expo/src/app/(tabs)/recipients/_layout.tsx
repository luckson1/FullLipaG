import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: "modal",
          headerStyle: { backgroundColor: "rgb(20 184 166)" },
          headerTitleStyle: { color: "#fff" },
          headerTitle: " Who will you be sending money to?",
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: "modal",
          headerStyle: { backgroundColor: "rgb(20 184 166)" },
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: "modal",
          headerStyle: { backgroundColor: "rgb(20 184 166)" },
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: "modal",
          headerStyle: { backgroundColor: "rgb(20 184 166)" },
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Stack.Screen
        name="confirmation"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: "modal",
          title: "Confirm payment Details",
          headerStyle: { backgroundColor: "rgb(20 184 166)" },
          headerTitleStyle: { color: "#fff" },
        }}
      />
    </Stack>
  );
};

export default _layout;
