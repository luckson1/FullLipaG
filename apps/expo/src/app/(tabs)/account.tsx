import React from "react";
import {
  Button,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Avatar, Icon } from "@rneui/themed";

const account = () => {
  return (
    <ScrollView className="flex-1">
      <SafeAreaProvider className="flex h-full w-full items-center justify-center bg-white ">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="my-10 flex w-full max-w-md p-5">
          <View className="my-10  border-b border-slate-300 py-2">
            <Text className=" text-lg">You are using the service as</Text>
          </View>
          <View className="flex w-full flex-row items-center justify-center">
            <View className="flex h-fit w-3/4 flex-row items-center justify-center gap-1">
              <View className="w-1/4 ">
                <Avatar
                  size={64}
                  rounded
                  source={{
                    uri: "https://randomuser.me/api/portraits/men/36.jpg",
                  }}
                />
              </View>
              <View className="flex   w-3/4">
                <Text className=" text-lg font-semibold">Jack Gathondu</Text>
              </View>
            </View>

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
                <View className=" rounded-full bg-slate-300">
                  <Icon name="help" type="material" size={32} color={"white"} />
                </View>
                <View className="w-2/3">
                  <Text className="w-full text-lg leading-loose tracking-wide  text-slate-600 ">
                    Help
                  </Text>
                </View>

                <View className=" w-1/6 rounded-full">
                  <Icon
                    name="arrow-right"
                    type="font-awesome"
                    size={24}
                    color={"#4ade80"}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className=" mt-7 flex w-full items-center justify-center   p-2 ">
            <View className="w-full">
              <View className="flex w-full flex-row items-center justify-between">
                <View className="  flex h-10 w-10 items-center justify-center rounded-full bg-slate-300">
                  <Icon
                    name="user"
                    type="font-awesome"
                    size={24}
                    color={"white"}
                  />
                </View>
                <View className="w-2/3">
                  <Text className="w-full text-lg leading-loose tracking-wide  text-slate-600 ">
                    {" "}
                    Personal Details
                  </Text>
                </View>
                <View className="w-1/6">
                  <View className="rounded-full">
                    <Icon
                      name="arrow-right"
                      type="font-awesome"
                      size={24}
                      color={"#4ade80"}
                    />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className=" mt-7 flex w-full items-center justify-center   p-2 ">
            <View className="w-full">
              <View className="flex w-full flex-row items-center justify-between">
                <View className="  flex h-10 w-10 items-center justify-center rounded-full bg-slate-300">
                  <Icon
                    name="shield"
                    type="font-awesome"
                    size={24}
                    color={"white"}
                  />
                </View>
                <View className="w-2/3">
                  <Text className="w-full text-lg leading-loose tracking-wide  text-slate-600 ">
                    Privacy and Security
                  </Text>
                </View>
                <View className="w-1/6">
                  <View className="rounded-full">
                    <Icon
                      name="arrow-right"
                      type="font-awesome"
                      size={24}
                      color={"#4ade80"}
                    />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className=" mt-7 flex w-full items-center justify-center   p-2 ">
            <View className="w-full">
              <View className="flex w-full flex-row items-center justify-between">
                <View className="  flex h-10 w-10 items-center justify-center rounded-full bg-slate-300">
                  <Icon
                    name="logout"
                    type="material"
                    size={24}
                    color={"white"}
                  />
                </View>
                <View className="w-2/3">
                  <Text className="w-full text-lg leading-loose tracking-wide  text-slate-600 ">
                    Logout
                  </Text>
                </View>
                <View className="w-1/6">
                  <View className="rounded-full">
                    <Icon
                      name="arrow-right"
                      type="font-awesome"
                      size={24}
                      color={"#4ade80"}
                    />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className=" mt-7 flex w-full items-center justify-center   p-2 ">
            <View className="w-full">
              <View className="flex flex-row items-center justify-between">
                <View className="  flex h-10 w-10 items-center justify-center rounded-full bg-slate-300">
                  <Icon
                    name="settings"
                    type="material"
                    size={24}
                    color={"white"}
                  />
                </View>
                <View className="w-2/3">
                  <Text className="w-full text-lg leading-loose tracking-wide  text-slate-600 ">
                    Settings
                  </Text>
                </View>
                <View className="w-1/6">
                  <View className="rounded-full">
                    <Icon
                      name="arrow-right"
                      type="font-awesome"
                      size={24}
                      color={"#4ade80"}
                    />
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

export default account;
