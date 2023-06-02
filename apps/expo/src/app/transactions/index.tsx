import React from "react";
import { Pressable, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { FlatList } from "native-base";

import { api } from "~/utils/api";
import LoadingComponent from "~/components/LoadingComponent";

const Transactions = () => {
  const {
    data: transactionData,
    isLoading,
    isError,
  } = api.transaction.getUsersAll.useQuery(undefined, {
    onError(error) {
      Toast.show(error.message, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        shadow: true,
        backgroundColor: "white",
        animation: true,
        hideOnPress: true,
        textColor: "red",
        delay: 0,
      });
    },
  });
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar />

      <View className="flex w-full items-start justify-center">
        <View className="w-full  max-w-md">
          <View className="my-3 py-5">
            <Text className=" text-center text-xl font-bold">History</Text>
          </View>
          {isLoading && !isError && (
            <View className="flex h-full w-full items-center justify-center">
              <LoadingComponent />
            </View>
          )}
          {!isLoading && transactionData && (
            <FlatList
              className="  mt-3 flex"
              data={transactionData}
              renderItem={({ item }) => (
                <Pressable
                  className="my-5 flex flex-row  justify-between"
                  onPress={() =>
                    router.push(`transactions/overview/id?id=${item.id}`)
                  }
                >
                  <View className="flex w-[65%] flex-row ">
                    <View className="flex w-1/4  items-center justify-center">
                      <AntDesign
                        size={40}
                        name={
                          item.Status?.at(0)?.name === "Received"
                            ? "checkcircle"
                            : item.Status?.at(0)?.name === "Cancelled" ||
                              item.Status?.at(0)?.name === "Declined"
                            ? "closecircle"
                            : item.Status?.at(0)?.name === "Paused"
                            ? "pausecircle"
                            : item.Status?.at(0)?.name === "Sent"
                            ? "rocket1"
                            : "infocirlce"
                        }
                        color={
                          item.Status?.at(0)?.name === "Received" ||
                          item.Status?.at(0)?.name === "Processed"
                            ? "#4ade80"
                            : item.Status?.at(0)?.name === "Cancelled" ||
                              item.Status?.at(0)?.name === "Declined"
                            ? "#ef4444"
                            : item.Status?.at(0)?.name === "Paused" ||
                              item.Status?.at(0)?.name === "To_Confirm"
                            ? "rgb(234 179 8)"
                            : "rgb(14 165 233 )"
                        }
                      />
                    </View>

                    <View className="flex">
                      <Text className="font-medium text-slate-600">
                        {item.recipient.name}
                      </Text>
                      <Text
                        className={` ${
                          item.Status?.at(0)?.name === "Received"
                            ? "text-[#4ade80]"
                            : item.Status?.at(0)?.name === "Cancelled" ||
                              item.Status?.at(0)?.name === "Declined"
                            ? "text-[#ef4444]"
                            : item.Status?.at(0)?.name === "Paused" ||
                              item.Status?.at(0)?.name === "To_Confirm"
                            ? "text-yellow-500"
                            : "text-sky-500"
                        }`}
                      >
                        {item.Status.at(0)?.name === "To_Confirm"
                          ? "Confirmation Needed"
                          : item.Status.at(0)?.name}
                      </Text>
                    </View>
                  </View>
                  <View className="flex  w-[35%] flex-row items-center justify-center">
                    <View className="flex w-[70%] items-center justify-center">
                      <Text className="text-slate-600">
                        {item.payment.ExchangeRate.target}
                      </Text>
                      <Text className="font-bold text-slate-600">
                        {item.payment.sentAmount.toLocaleString()}
                      </Text>
                    </View>
                    <AntDesign
                      name="right"
                      size={32}
                      color={"rgb(74 222 128)"}
                    />
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Transactions;
