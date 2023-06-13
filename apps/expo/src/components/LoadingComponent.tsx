import React from "react";
import { Text, View } from "react-native";
import { SvgUri } from "react-native-svg";

import LoadingDots from "./LoadingDots";

const LoadingComponent = () => {
  return (
    <View className="flex h-full w-full items-center justify-between rounded-lg bg-teal-500">
      <View className=" flex h-[80%] w-full items-center justify-center">
        <SvgUri
          width="70%"
          height="70%"
          uri="https://res.cloudinary.com/dhciks96e/image/upload/v1685356475/undraw_loading_re_5axr_yv9xce.svg"
        />
        <Text className="  text-center text-4xl text-white">Loading</Text>
        <LoadingDots size={40} color="white" />
      </View>
    </View>
  );
};

export default LoadingComponent;
