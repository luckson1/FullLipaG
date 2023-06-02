import React from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Avatar } from "@rneui/themed";

import { api } from "~/utils/api";
import useStore from "~/utils/zuztand";
import LoadingComponent from "~/components/LoadingComponent";
import NoContent from "~/components/NoContent";

const Index = () => {
  const { data, isLoading } = api.recipient.getUsersAll.useQuery(undefined, {
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
  const router = useRouter();
  const [addRecipient, paymentInProgress] = useStore((state) => [
    state.setNewRecipient,
    state.currentPayment,
  ]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar />

      <View className="flex  h-fit w-full items-center justify-center p-5 ">
        <View className=" h-full w-full max-w-md">
          <Text className="text-bold my-5 text-xl">
            Who will you be sending money to?
          </Text>
          <View className="flex w-full flex-row items-center justify-between">
            <Text className="mb-10 mt-5 flex items-center  justify-center text-xl font-bold">
              Recipients
            </Text>
            <TouchableOpacity
              className="flex w-24 flex-row items-center justify-around  rounded-md bg-green-400 py-3"
              onPress={() => router.push("/recipients/add")}
            >
              <AntDesign name="plus" size={24} color={"white"} />
              <Text className="text-white">Add</Text>
            </TouchableOpacity>
          </View>
          <View className="w-full">
            {!isLoading && data && data.length <= 0 && (
              <View className="h-full w-full">
                <NoContent content="recipients" />

                <TouchableOpacity
                  className="my-5 w-full rounded-xl bg-green-400 py-3"
                  onPress={() => router.push("/recipients/add")}
                >
                  <Text className="text-center text-lg text-white">
                    Add a Recipient
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {isLoading && (
              <View className="h-full w-full">
                <LoadingComponent />
              </View>
            )}
            <FlatList
              keyExtractor={(item) => item.id}
              className="flex w-full"
              data={data}
              renderItem={({ item }) => (
                <Pressable
                  className="my-5 flex w-full flex-row  items-center justify-between"
                  onPress={() => {
                    addRecipient(item);
                    router.push(`/recipients/id?id=${item.id}`);
                  }}
                >
                  <View className="flex w-8/12 flex-row  items-center">
                    <View className="w-1/4">
                      <Avatar
                        size={48}
                        rounded
                        icon={{ name: "user", type: "font-awesome" }}
                        containerStyle={{
                          backgroundColor: "#9700b9",
                        }}
                      />
                    </View>

                    <View className="flex">
                      <Text className="font-medium">{item.name}</Text>
                      <Text className="text-sm text-slate-600">
                        {" "}
                        {item.bankAccount}
                      </Text>
                    </View>
                  </View>
                  <View className="flex w-1/4">
                    {paymentInProgress && (
                      <TouchableOpacity
                        className="flex w-20 flex-row items-center justify-around  rounded-md bg-green-400 py-2"
                        onPress={(e) => {
                          e.stopPropagation();
                          addRecipient(item);
                          router.push("/recipients/confirmation");
                        }}
                      >
                        <Text className=" text-sm text-white">Send</Text>
                        <MaterialIcons name="send" size={20} color={"white"} />
                      </TouchableOpacity>
                    )}
                    {!paymentInProgress && (
                      <View className="flex flex-row items-center justify-end ">
                        <AntDesign
                          name="right"
                          size={32}
                          color={"rgb(74 222 128 )"}
                        />
                      </View>
                    )}
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Index;
