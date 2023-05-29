import React from "react";
import { Text, View } from "react-native";
import { SvgUri } from "react-native-svg";

const NoContent = ({ content }: { content: string }) => {
  return (
    <View className="h-[60%] w-full ">
      <View className="my-5 flex h-full w-full items-center justify-center">
        <SvgUri
          width="70%"
          height="70%"
          uri="https://res.cloudinary.com/dhciks96e/image/upload/v1685287033/undraw_no_data_re_kwbl_cys2lm.svg"
        />
        <Text className=" my-5 text-center text-lg">No {content} found</Text>
      </View>
    </View>
  );
};

export default NoContent;
