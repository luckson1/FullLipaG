import React, { useEffect } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { Tabs, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { Avatar, Icon } from "@rneui/themed";

import { api } from "~/utils/api";
import LoadingComponent from "~/components/LoadingComponent";
import NoContent from "~/components/NoContent";

const Index = () => {
  const router = useRouter();
  const {
    data: userData,
    isLoading,
    isError,
  } = api.profile.getUserData.useQuery(undefined, {
    onError(error) {
      Toast.show(error.message, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        textColor: "red",
        delay: 0,
      });
    },
  });

  const profile = userData?.Profile;
  const transactionData = userData?.Transaction;
  const { data: rates } = api.exchange.getLatestRates.useQuery();

  useEffect(() => {
    if (!profile?.firstName && !isLoading && isError) router.push("/profile");
  }, [router, profile, isLoading, isError]);

  const maximumList = 4;

  return (
    <SafeAreaView className="flex-1 ">
      <Tabs.Screen options={{ headerShown: false }} />
      <StatusBar backgroundColor="rgb(20 184 166)" />
      {isLoading && (
        <View className="h-full w-full">
          <LoadingComponent />
        </View>
      )}
      {!isLoading && (
        <View className="h-full w-full">
          <ScrollView className=" h-1/2 min-h-[270px] w-full bg-teal-500 px-5  pb-5 pt-16">
            <View className="flex h-full w-full items-center gap-y-8 ">
              <View className="flex w-full max-w-md flex-row items-center  justify-between">
                <View className="flex w-3/4 flex-row items-center justify-center gap-3">
                  <View className="flex w-1/4 items-center justify-center">
                    <Avatar
                      containerStyle={{
                        backgroundColor: "rgb(74 222 128 )",
                        padding: 5,
                      }}
                      size={64}
                      rounded
                      source={{
                        uri:
                          userData?.Profile?.image ??
                          (userData?.Profile?.gender === "Female"
                            ? "https://res.cloudinary.com/dhciks96e/image/upload/v1685280960/Female-Avatar_h8qvjc.png"
                            : "https://res.cloudinary.com/dhciks96e/image/upload/v1685280974/Male-Avatar-3_q1g6un.png"),
                      }}
                    />
                  </View>
                  <View className="flex  h-fit w-3/5">
                    <Text className=" text-white">Welcome Back</Text>
                    <Text className="text-xl font-semibold  text-white">
                      {profile?.firstName}
                    </Text>
                    <Text className="text-xl font-semibold  text-white">
                      {profile?.lastName}
                    </Text>
                  </View>
                </View>

                <View className="flex h-fit w-1/4 flex-row gap-2 ">
                  <TouchableHighlight
                    className="w-full flex-1 rounded-full "
                    onPress={() => router.push("/help")}
                  >
                    <Icon
                      style={{
                        backgroundColor: "inherit",
                      }}
                      name="help"
                      color="white"
                      type="material"
                      size={30}
                    />
                  </TouchableHighlight>
                  <TouchableHighlight
                    className="flex-1 rounded-full"
                    onPress={() => router.push("/profile")}
                  >
                    <Icon
                      style={{
                        backgroundColor: "inherit",
                        borderRadius: 30,
                      }}
                      name="gear"
                      color="white"
                      type="font-awesome"
                      size={30}
                    />
                  </TouchableHighlight>
                </View>
              </View>

              <View className="flex w-full max-w-md items-center justify-center">
                <Text className="my-5 text-center text-white">
                  Todays Exchange Rates
                </Text>
                <View className=" mx-auto mb-5  h-32 w-full items-center justify-center rounded-2xl bg-slate-700 p-5 shadow shadow-yellow-500/100">
                  {rates?.map((rate) => (
                    <Text
                      key={rate.id}
                      className="my-3 text-lg font-bold tracking-widest text-white"
                    >
                      1 {rate.target} = {rate?.Rate?.at(0)?.value} 🇰🇪 KES
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          <View className=" flex h-1/2 w-full items-center justify-center bg-white px-5 py-5">
            <View className="mb-4 flex w-full max-w-md flex-row justify-between">
              <Text className="text-xl font-semibold text-slate-600">
                {" "}
                History
              </Text>
              <TouchableOpacity
                className="flex flex-row"
                onPress={() => router.push("/transactions")}
              >
                <Text className="text text-sky-400">View All Transactions</Text>
                <Icon
                  style={{
                    padding: 8,
                    backgroundColor: "inherit",
                    borderRadius: 30,
                    fontWeight: "bold",
                  }}
                  size={12}
                  name="arrow-right"
                  color="#38bdf8"
                  type="simple-line-icon"
                />
              </TouchableOpacity>
            </View>
            <View className="h- my-4 h-[80%] w-full max-w-md">
              {!isLoading && transactionData && transactionData.length <= 0 && (
                <View className="h-full w-full">
                  <NoContent content="transactions" />

                  <TouchableOpacity
                    className="my-5 w-full rounded-xl bg-green-400 py-3"
                    onPress={() => {
                      router.push("/send");
                    }}
                  >
                    <Text className="text-center text-lg text-white">
                      Make a payment
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {!isLoading && transactionData && (
                <FlatList
                  className=" mt-3 flex gap-3 "
                  data={transactionData.slice(0, maximumList)}
                  renderItem={({ item }) => (
                    <Pressable
                      className="my-3 flex flex-row  justify-between"
                      onPress={() =>
                        router.push(`transactions/overview/id?id=${item.id}`)
                      }
                    >
                      <View className="flex w-8/12 flex-row gap-3">
                        <View className="flex w-1/4  items-center justify-center">
                          <AntDesign
                            size={40}
                            name={
                              item.Status?.at(0)?.name === "Received"
                                ? "checkcircleo"
                                : item.Status?.at(0)?.name === "Canceled" ||
                                  item.Status?.at(0)?.name === "Declined"
                                ? "closecircleo"
                                : item.Status?.at(0)?.name === "Paused"
                                ? "pausecircleo"
                                : item.Status?.at(0)?.name === "Sent"
                                ? "rocket1"
                                : "infocirlceo"
                            }
                            color={
                              item.Status?.at(0)?.name === "Received"
                                ? "#4ade80"
                                : item.Status?.at(0)?.name === "Canceled" ||
                                  item.Status?.at(0)?.name === "Declined"
                                ? "#ef4444"
                                : item.Status?.at(0)?.name === "Paused"
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
                                : item.Status?.at(0)?.name === "Canceled" ||
                                  item.Status?.at(0)?.name === "Declined"
                                ? "text-[#ef4444]"
                                : item.Status?.at(0)?.name === "Paused"
                                ? "text-amber-500"
                                : "text-sky-500"
                            }`}
                          >
                            {item.Status.at(0)?.name}
                          </Text>
                        </View>
                      </View>
                      <View className="flex w-1/5">
                        <Text className="text-slate-600">
                          {item.payment.ExchangeRate.target}
                        </Text>
                        <Text className="font-bold text-slate-600">
                          {item.payment.sentAmount.toLocaleString()}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                />
              )}
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Index;
