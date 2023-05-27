import { View, Text, SafeAreaView, FlatList } from "react-native";

import React from "react";
import { Stack, useRouter, useSearchParams } from "expo-router";

import { StatusBar } from "expo-status-bar";
import { Avatar, Button, Icon } from "@rneui/themed";

const Index = () => {
  const data = [
    {
      id: "2",
      name: "Acorn Ltd",
      account: "1234 5678 9012 3456",
      bank: "China CITIC Bank",
      currency: "USD",
    },

    {
      id: "4",
      name: "Ho Lee Sheet Inc",
      account: "6225 8801 2345 6789",
      bank: "China Minsheng Bank",
      currency: "USD",
    },
  ];
  const router = useRouter();
  const params = useSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar />

      <View className="flex  w-full items-center justify-center p-5 ">
        <View className=" w-full max-w-md">
          <View className="flex w-full flex-row items-center justify-between">
            <Text className="my-10 flex items-center  justify-center text-xl font-bold">
              Recipients
            </Text>
            <Button
              radius={"sm"}
              type="solid"
              className="flex flex-row gap-2"
              color={"#4ade80"}
             
              onPress={() => router.push("/recipients/add")}
            >
              <Icon name="plus" size={24} type="font-awesome" color={"white"} /> Add
            </Button>
          </View>
          <View className="w-full">
            <FlatList
              className="flex w-full"
              data={data}
              renderItem={({ item }) => (
                <View className="my-3 flex w-full flex-row  items-center justify-between">
                  <View className="flex w-8/12 flex-row  items-center gap-1">
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
                      <Text className="font-medium">
                        {item.name} {item.currency}
                      </Text>
                      <Text className="text-sm text-slate-600">
                        {" "}
                        {item.account}
                      </Text>
                    </View>
                  </View>
                  <View className="flex w-1/5">
                    <Button
                      radius={"sm"}
                      type="solid"
                      className="flex flex-row"
                      color={"#4ade80"}
                      onPress={() => router.push("transactions/id")}
                    >
                       <Icon name="send" type="font-awesome" color={"white"} />
                    
                    </Button>
                    {/* <TouchableOpacity className="flex items-baseline justify-center   rounded-lg bg-green-400 py-1 shadow-xl shadow-green-400/100">
                    <Text className="mx-auto text-center text-sm text-white">
                      Send
                    </Text>
                  </TouchableOpacity> */}
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Index;
