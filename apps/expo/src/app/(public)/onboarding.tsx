import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SvgUri } from "react-native-svg";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useUser } from "@supabase/auth-helpers-react";

const DATA = [
  {
    key: "1",
    title: "Affordable Remittances",
    description: "Send money at better rates FX rates!",
    image:
      "https://res.cloudinary.com/dhciks96e/image/upload/v1684398772/undraw_transfer_money_re_6o1h_ddgpxn.svg",
  },
  {
    key: "2",
    title: "Secure Mobile Payments",
    description: "Safe and encrypted transactions!",
    image:
      "https://res.cloudinary.com/dhciks96e/image/upload/v1684399133/undraw_online_banking_re_kwqh_v7zyku.svg",
  },
  {
    key: "3",
    title: "Convenient Transactions",
    description: "No more long bank queues. Send money with ease,!",
    image:
      "https://res.cloudinary.com/dhciks96e/image/upload/v1684399254/undraw_investment_data_re_sh9x_c3k6kt.svg",
  },
  {
    key: "4",
    title: "Fast and Reliable",
    description: "Same day or next day payments!",
    image:
      "https://res.cloudinary.com/dhciks96e/image/upload/v1684399339/undraw_mobile_pay_re_sjb8_ujccln.svg",
  },
];

const bgs = ["#14b8a6", "#6366f1", "#14b8a6", "#6366f1"];
const Indicator = ({
  scrollX,
  width,
}: {
  scrollX: Animated.Value;
  width: number;
}) => {
  return (
    <View className="absolute bottom-5 flex flex-row ">
      {DATA.map((_, i) => {
        const scale = scrollX.interpolate({
          inputRange: [(i - 1) * width, i * width, (i + 1) * width],
          outputRange: [0.8, 1.4, 0.8],
          extrapolate: "clamp",
        });
        const opacity = scrollX.interpolate({
          inputRange: [(i - 1) * width, i * width, (i + 1) * width],
          outputRange: [0.6, 1, 0.6],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            key={`indicator-${i}`}
            className="m-3 h-3 w-3 rounded-md bg-slate-50 "
            style={{
              opacity,
              transform: [
                {
                  scale,
                },
              ],
            }}
          />
        );
      })}
    </View>
  );
};
const Backdrop = ({
  scrollX,
  width,
}: {
  scrollX: Animated.Value;
  width: number;
}) => {
  const backgroundColor = scrollX.interpolate({
    inputRange: bgs.map((_, i) => i * width),
    outputRange: bgs.map((bg) => bg),
  });
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor,
        },
      ]}
    />
  );
};

const Square = ({
  scrollX,
  width,
  height,
}: {
  scrollX: Animated.Value;
  width: number;
  height: number;
}) => {
  const YOLO = Animated.modulo(
    Animated.divide(Animated.modulo(scrollX, width), new Animated.Value(width)),
    1,
  );
  const rotate = YOLO.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["35deg", "0deg", "35deg"],
  });
  const translateX = YOLO.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -height, -0],
  });
  return (
    <Animated.View
      style={{
        width: height,
        height: height,
        backgroundColor: "#fff",
        borderRadius: 86,
        position: "absolute",
        top: -height * 0.6,
        left: -height * 0.3,
        transform: [
          {
            rotate,
          },
          {
            translateX,
          },
        ],
      }}
    />
  );
};
const Onboarding = () => {
  const router = useRouter();
  const user = useUser();
  const userId = user?.id;
  useEffect(() => {
    if (userId) router.push("/home");
    return;
  }, [router, userId]);
  const dimentions = Dimensions.get("screen");
  const { width, height } = dimentions;

  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View className="flex flex-1 items-center justify-center bg-white">
      <StatusBar />
      <Stack.Screen options={{ headerShown: false }} />

      <Backdrop scrollX={scrollX} width={width} />
      <Square height={height} width={width} scrollX={scrollX} />
      <Animated.FlatList
        data={DATA}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        scrollEventThrottle={32}
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <View className="justify-center align-middle" style={{ width }}>
              <View className="flex  w-full  flex-[60%] items-center justify-center bg-inherit p-5">
                <SvgUri width="70%" height="70%" uri={item.image} />
              </View>
              <View className=" flex flex-[30%] justify-start p-5">
                <Text className="my-4 mt-8  text-2xl font-semibold tracking-wide text-white">
                  {item.title}
                </Text>
                <Text className="tracking-wide text-white">
                  {item.description}
                </Text>
              </View>
            </View>
          );
        }}
      />
      <View className="absolute bottom-16 flex w-full flex-row justify-between px-5">
        <Pressable
          android_ripple={{ color: "#4ade80", radius: 40 }}
          className="flex w-1/3 items-center justify-center rounded-lg bg-slate-100 py-3"
          onPress={() => router.push("/auth")}
        >
          <Text className="text-lg text-slate-700">Login</Text>
        </Pressable>
        <Pressable
          android_ripple={{ color: "#4ade80", radius: 40 }}
          className="flex w-1/3 items-center justify-center rounded-lg bg-slate-100 py-3"
          onPress={() => router.push("/auth")}
        >
          <Text className="text-lg text-slate-700 ">Sign up</Text>
        </Pressable>
      </View>
      <Indicator scrollX={scrollX} width={width} />
    </View>
  );
};

export default Onboarding;
