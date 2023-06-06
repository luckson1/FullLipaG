import React, { useEffect, useRef, useState } from "react";
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import Toast from "react-native-root-toast";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckBox } from "@rneui/themed";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  phoneNumber: z.string(),
});

type FormData = z.infer<typeof schema>;

const LoginScreen = () => {
  const supabase = useSupabaseClient();
  const textInput = useRef<TextInput>(null);
  useEffect(() => {
    textInput.current?.focus();
  }, []);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      phoneNumber: "",
    },
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const { data: userSession, error } = await supabase.auth.signInWithOtp({
      phone: `+254${data.phoneNumber}`,
    });
    if (userSession) {
      router.push(`/verification?number=${data.phoneNumber}`);
      setIsLoading(false);
    }
    if (error) {
      setIsLoading(false);
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
    }
    return;
  };
  const [isAgreed, setIsAgreed] = useState(true);
  return (
    <SafeAreaView className="h-screen w-screen flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar />
      <View className="flex h-full w-full flex-[80%] items-center justify-center p-5">
        <View className="flex w-full  max-w-md  rounded-lg">
          <Text className="my-10 text-4xl font-bold text-slate-700">
            Hi 👋, Welcome
          </Text>

          <Text className="text-lg text-slate-700">
            Login or sign up with your phone
          </Text>
          <View
            className={`k my-5 flex h-fit w-full  flex-row items-center justify-start border-b px-5  focus:border-green-500 focus:ring-green-500 ${
              errors.phoneNumber ? "border border-red-500" : ""
            }`}
          >
            <Text className=" text-xl text-slate-400">+254(0)</Text>
            <Controller
              control={control}
              name="phoneNumber"
              defaultValue=""
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={textInput}
                  autoCapitalize="none"
                  keyboardType="phone-pad"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  className=" block w-full rounded-md    px-1  py-3 text-xl"
                />
              )}
            />
          </View>

          {errors.phoneNumber && (
            <Text className="mb-4 text-red-500">
              {errors.phoneNumber.message}
            </Text>
          )}

          <View className="my-10 flex w-full flex-row items-center justify-center gap-x-3">
            <CheckBox
              className="red"
              checked={isAgreed}
              onPress={() => setIsAgreed((prev) => !prev)}
              iconType="material-community"
              checkedIcon="checkbox-outline"
              uncheckedIcon={"checkbox-blank-outline"}
              checkedColor="#4ade80"
            />
            <Text className=" text-slate-700">
              By checking this box, I agree to the terms ans conditions of the
              application
            </Text>
          </View>
        </View>
      </View>
      <View className="flex w-full flex-[20%] items-center justify-center p-5">
        <Pressable
          android_ripple={{ color: "#4ade80", radius: 40 }}
          disabled={!isAgreed && isLoading}
          onPress={handleSubmit(onSubmit)}
          className={` absolute bottom-10 mb-4 flex w-full flex-row items-center justify-around rounded-lg px-4 py-3 ${
            isAgreed && !isLoading ? " bg-teal-400 " : "bg-slate-200"
          }`}
        >
          <Text
            className={`${
              isAgreed && !isLoading
                ? "text-lg font-bold text-gray-50"
                : "text-lg font-bold text-gray-500"
            }`}
          >
            Let me in
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
export default LoginScreen;
