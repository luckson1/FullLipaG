import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: "Transaction Information",
          headerTitleStyle: { color: "#FFF" },
        }}
      />
    </Stack>
  );
};

export default _layout;
