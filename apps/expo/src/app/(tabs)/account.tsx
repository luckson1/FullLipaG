import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Avatar } from "@rneui/themed";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { api } from "~/utils/api";

const Account = () => {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { data: profile } = api.profile.getUserProfile.useQuery(undefined, {
    onError(error) {
      Toast.show(error.message, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        backgroundColor: "white",
        hideOnPress: true,
        textColor: "red",
        delay: 0,
      });
    },
  });
  return (
    <ScrollView className="flex-1">
      <SafeAreaProvider className="flex h-full w-full items-center justify-center bg-white ">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="my-10 flex w-full max-w-md p-5">
          <View className="my-10  border-b border-slate-300 py-2">
            <Text className=" text-lg">You are using the service as</Text>
          </View>
          <View className="flex w-full flex-row items-center justify-center">
            {profile && (
              <View className="flex h-fit w-3/4 flex-row items-center justify-center gap-1">
                <View className="w-1/4 ">
                  <Avatar
                    size={64}
                    rounded
                    source={{
                      uri:
                        profile.image ??
                        (profile.gender === "Female"
                          ? "https://res.cloudinary.com/dhciks96e/image/upload/v1685280960/Female-Avatar_h8qvjc.png"
                          : "https://res.cloudinary.com/dhciks96e/image/upload/v1685280974/Male-Avatar-3_q1g6un.png"),
                    }}
                  />
                </View>
                <View className="flex   w-3/4">
                  <Text className=" text-lg font-semibold">
                    {profile.firstName} {profile.lastName}
                  </Text>
                </View>
              </View>
            )}

            <View className="flex h-fit w-1/4 flex-row gap-2">
              <Pressable className="rounded-md bg-green-400 px-5 py-2">
                <Text>Edit</Text>
              </Pressable>
            </View>
          </View>
          <View className="my-10  border-b border-slate-300 py-2">
            <Text className=" text-lg">General</Text>
          </View>
          <TouchableOpacity className=" mt-7 flex w-full items-center justify-center   p-2 ">
            <View className=" w-full">
              <View className="flex w-full flex-row items-center justify-between">
                <View className="  flex h-10 w-10 items-center justify-center rounded-full bg-teal-500">
                  <AntDesign name="question" size={32} color={"white"} />
                </View>
                <View className="w-2/3">
                  <Text className="w-full text-lg leading-loose tracking-wide  text-slate-600 ">
                    Help
                  </Text>
                </View>

                <View className=" w-1/6 rounded-full">
                  <AntDesign name="right" size={24} color={"#4ade80"} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className=" mt-7 flex w-full items-center justify-center   p-2 "
            onPress={() => router.push("/profile")}
          >
            <View className="w-full">
              <View className="flex w-full flex-row items-center justify-between">
                <View className="  flex h-10 w-10 items-center justify-center rounded-full bg-teal-500">
                  <AntDesign name="user" size={24} color={"white"} />
                </View>
                <View className="w-2/3">
                  <Text className="w-full text-lg leading-loose tracking-wide  text-slate-600 ">
                    {" "}
                    Personal Details
                  </Text>
                </View>
                <View className="w-1/6">
                  <View className="rounded-full">
                    <AntDesign name="right" size={24} color={"#4ade80"} />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className=" mt-7 flex w-full items-center justify-center   p-2 ">
            <View className="w-full">
              <View className="flex w-full flex-row items-center justify-between">
                <View className="  flex h-10 w-10 items-center justify-center rounded-full bg-teal-500">
                  <Entypo name="shield" size={24} color={"white"} />
                </View>
                <View className="w-2/3">
                  <Text className="w-full text-lg leading-loose tracking-wide  text-slate-600 ">
                    Privacy and Security
                  </Text>
                </View>
                <View className="w-1/6">
                  <View className="rounded-full">
                    <AntDesign name="right" size={24} color={"#4ade80"} />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className=" mt-7 flex w-full items-center justify-center   p-2 "
            onPress={() => supabase.auth.signOut()}
          >
            <View className="w-full">
              <View className="flex w-full flex-row items-center justify-between">
                <View className="  flex h-10 w-10 items-center justify-center rounded-full bg-teal-500">
                  <AntDesign name="logout" size={24} color={"white"} />
                </View>
                <View className="w-2/3">
                  <Text className="w-full text-lg leading-loose tracking-wide  text-slate-600 ">
                    Logout
                  </Text>
                </View>
                <View className="w-1/6">
                  <View className="rounded-full">
                    <AntDesign name="right" size={24} color={"#4ade80"} />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className=" mt-7 flex w-full items-center justify-center   p-2 ">
            <View className="w-full">
              <View className="flex flex-row items-center justify-between">
                <View className="  flex h-10 w-10 items-center justify-center rounded-full bg-teal-500">
                  <AntDesign name="setting" size={24} color={"white"} />
                </View>
                <View className="w-2/3">
                  <Text className="w-full text-lg leading-loose tracking-wide  text-slate-600 ">
                    Settings
                  </Text>
                </View>
                <View className="w-1/6">
                  <View className="rounded-full">
                    <AntDesign name="right" size={24} color={"#4ade80"} />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    </ScrollView>
  );
};

export default Account;
