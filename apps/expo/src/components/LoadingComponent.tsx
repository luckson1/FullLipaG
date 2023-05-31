import React from "react";
import { Text, View } from "react-native";
import { SvgUri } from "react-native-svg";

const LoadingComponent = () => {
  return (
    <View className="h-[60%] w-full ">
      <View className="my-5 flex h-full w-full items-center justify-center bg-teal-50 opacity-20">
        <SvgUri
          width="70%"
          height="70%"
          uri="https://res.cloudinary.com/dhciks96e/image/upload/v1685356475/undraw_loading_re_5axr_yv9xce.svg"
        />
        <Text className=" my-5 text-center text-2xl">Loading .....</Text>
      </View>
    </View>
  );
};

export default LoadingComponent;
