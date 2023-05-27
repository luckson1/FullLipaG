import { View, Text,} from "react-native";
import React  from "react";
import { Avatar, } from "@rneui/themed";
import { FlatList, } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";


const data = [
  {
    id: "1",
    name: "Foo Fashion",
    status: "completed",
    currency: "CYN",
    amount: 9499,
    date: "Sun Apr 23, 2023 17:18",
  },
  {
    id: "2",
    name: "Acorn Ltd",
    status: "canceled",
    currency: "USD",
    amount: 7000,
    date: "Sun Apr 23, 2023 17:18",
  },
  {
    id: "3",
    name: "Yee Kung Fu Ltd",
    status: "pending",
    amount: 13570,
    currency: "USD",
    date: "Sun Apr 23, 2023 17:18",
  },
  {
    id: "4",
    name: "Ho Lee Sheet Inc",
    status: "sending",
    currency: "USD",
    amount: 10000,
    date: "Sun Apr 23, 2023 17:18",
  },
  {
    id: "5",
    name: "Foo Fashion",
    status: "completed",
    currency: "CYN",
    amount: 9500,
    date: "Sun Apr 23, 2023 17:18",
  },
  {
    id: "6",
    name: "Acorn Ltd",
    status: "completed",
    currency: "USD",
    amount: 7900,
    date: "Sun Apr 23, 2023 17:18",
  },
  {
    id: "7",
    name: "Yee Kung Fu Ltd",
    status: "completed",
    amount: 15000,
    currency: "USD",
    date: "Sun Apr 23, 2023 17:18",
  },
  {
    id: "8",
    name: "Ho Lee Sheet Inc",
    status: "completed",
    currency: "USD",
    amount: 10000,
    date: "Sun Apr 23, 2023 17:18",
  },
];


const Transactions = () => {

  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar />
   
     
      <View className="w-full flex justify-center items-start">
      <View className="w-full  max-w-md">
        <Text className="my-3 text-center text-xl font-bold">History</Text>
        <FlatList
          className=" flex gap-3 "
          data={data}
          renderItem={({ item }) => (
            <View className="my-3 flex flex-row  justify-between ">
              <View className="flex w-8/12 flex-row gap-3">
                <View className="w-1/4">
                  <Avatar
                    size={40}
                    rounded
                    icon={{ name: `${item.status==="completed"? "check": item.status==="canceled"? "ban" : item.status==="pending"? "exclamation": item.status==="sending"? "arrow-up": ""}`, type: "font-awesome" }}
                    containerStyle={{
                      backgroundColor: `${item.status==="completed"? "#4ade80" : item.status==="canceled"? "#ef4444" : item.status==="sending"? "rgb(217 119 6)": item.status==="pending"? "rgb(234 179 8)": ""}`,
                 
                      marginLeft: 12,
                    }}
                  />
                </View>

                <View className="flex">
                  <Text className="font-medium">{item.name}</Text>
                  <Text
                    className={` ${
                      item.status === "canceled"
                        ? "text-red-400 "
                        : item.status === "completed"
                        ? "text-green-400"
                        : item.status === "sending"
                        ? "text-amber-600"
                        : "text-yellow-500"
                    }`}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
              <View className="flex w-1/5">
                <Text>{item.currency}</Text>
                <Text className="font-bold">
                  {item.amount.toLocaleString()}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
      </View>
    </SafeAreaView>
  );
};

export default Transactions;
