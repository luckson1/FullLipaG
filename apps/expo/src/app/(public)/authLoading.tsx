import React from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";

import LoadingComponent from "~/components/LoadingComponent";

const authLoading = () => {
  return (
    <View className="flex-1">
      <StatusBar />
      <LoadingComponent />
    </View>
  );
};

export default authLoading;
