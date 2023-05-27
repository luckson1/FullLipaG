import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React from "react";
import { Tabs, useRouter } from "expo-router";
import { Avatar, Icon } from "@rneui/themed";
import { TouchableHighlight } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native";



const Index = () => {
  const router = useRouter();
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
  ];
  return (
    <SafeAreaView className="flex-1 ">
      <Tabs.Screen options={{ headerShown: false }} />
      <StatusBar backgroundColor="rgb(20 184 166)" />

      <ScrollView className=" h-1/2 min-h-[270px] w-full bg-teal-500 px-5  pb-5 pt-16">
        <View className="flex w-full h-full items-center gap-y-8 ">
          <View className="flex w-full max-w-md flex-row items-center  justify-between">
            <View className="flex w-3/4 flex-row gap-3 items-center justify-center">
              <View className="w-1/4 flex justify-center items-center ">
                <Avatar
                
                  size={64}
                  rounded
                  source={{
                    uri: "https://randomuser.me/api/portraits/men/36.jpg",
                  }}
                />
              </View>
              <View className="flex  h-fit w-3/5">
                <Text className=" text-white">Welcome Back</Text>
                <Text className="text-xl font-semibold  text-white">Jack</Text>
                <Text className="text-xl font-semibold  text-white">
                  Gathondu
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

          <View className="flex w-full max-w-md justify-center items-center">
            <Text className="text-center text-white my-5">
              Todays Exchange Rates
            </Text>
            <View className=" h-32 w-full  items-center justify-center gap-3 rounded-2xl bg-slate-700 p-5 shadow shadow-yellow-500/100 mx-auto mb-5">
              <Text className="text-lg font-bold tracking-widest text-white">
                {" "}
                1 🇺🇸 USD = 135.7 🇰🇪 KES
              </Text>
              <Text className="text-lg font-bold tracking-widest text-white">
                {" "}
                1 🇨🇳 CNY = 20.5 🇰🇪 KES
              </Text>
            </View>
            {/* <Button className="gap-x-2 flex flex-row w-full max-w-sm rounded-lg " 
            title={"Send"}
            radius={"md"}
      
    icon={{
      name: 'paper-plane',
      type: 'font-awesome',
      size: 18,
      color: 'white',
    }}

 
            size="lg"
    /> */}

          </View>
        </View>
      </ScrollView>

      <View className=" flex w-full items-center justify-center bg-white px-5 py-5">
        <View className="flex w-full max-w-md flex-row justify-between mb-4">
          <Text className="text-xl font-semibold text-slate-600"> History</Text>
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
        <View className="w-full max-w-md my-4">
          <FlatList
            className=" mt-3 flex gap-3 "
            data={data}
            renderItem={({ item }) => (
              <View className="my-3 flex flex-row  justify-between">
                <View className="flex w-8/12 flex-row gap-3">
                  <View className="w-1/4 text-teal-500 ">
                    <Avatar
                    
                      size={44}
                      rounded
                  
                      icon={{ name: `${item.status==="completed"? "check": item.status==="canceled"? "ban" : item.status==="pending"? "exclamation": item.status==="sending"? "arrow-up": ""}`, type: "font-awesome",  color: `${item.status==="completed"? "#4ade80" : item.status==="canceled"? "#ef4444" : item.status==="sending"? "rgb(217 119 6)": item.status==="pending"? "rgb(234 179 8)": ""}` }}
                      containerStyle={{
                        backgroundColor: "rgb(20 184 166)",
                      
                        
                   
                        
                      }}
                    />
                  </View>

                  <View className="flex">
                    <Text className="font-medium text-slate-600">{item.name}</Text>
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
                  <Text className="text-slate-600">{item.currency}</Text>
                  <Text className="font-bold text-slate-600">
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

export default Index;
