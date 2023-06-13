import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from "react-native";
import Toast from "react-native-root-toast";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { supabase } from "~/utils/supabase";
import LoadingDots from "~/components/LoadingDots";

const Otp = () => {
  const params = useSearchParams();
  let phoneNumber = "";

  const clockCall = useRef<number>();
  const defaultCountdown = 60;
  const [countdown, setCountdown] = useState(defaultCountdown);
  const navigation = useRouter();
  const textInput = useRef<TextInput>(null);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const decrementClock = useCallback(() => {
    if (countdown === 0) {
      setIsResendDisabled(false);
      setCountdown(0);
      clearInterval(clockCall.current);
    } else {
      setCountdown(countdown - 1);
    }
  }, [countdown]);
  useEffect(() => {
    clockCall.current = window.setInterval(() => {
      decrementClock();
    }, 1000);
    return () => {
      clearInterval(clockCall.current);
    };
  }, [decrementClock]);
  if (params && typeof params?.number === "string")
    phoneNumber = params?.number;

  const [otpCode, setOtpCode] = useState([""]);
  const handleOtpInputChange = (index: number, text: string) => {
    const updatedOtpCode = [...otpCode];
    updatedOtpCode[index] = text;
    setOtpCode(updatedOtpCode);
  };

  const handleResendOTP = () => {
    if (!isResendDisabled) {
      setCountdown(defaultCountdown);
      setIsResendDisabled(true);
      clearInterval(clockCall.current);

      clockCall.current = window.setInterval(() => {
        decrementClock();
      }, 1000);
    }
  };
  const rightOptLength = 6;
  const handlePasteFromClipboard = (text: string) => {
    if (text.length <= 1) {
      const updatedOtpCode = [...otpCode];
      updatedOtpCode[0] = text;
      setOtpCode(updatedOtpCode);
    } else {
      const formattedOTP = text.slice(0, rightOptLength);
      setOtpCode([...formattedOTP]);
    }
  };
  useEffect(() => {
    textInput.current?.focus();
  }, []);
  const handleDeleteKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (event.nativeEvent.key === "Backspace" && index === 5) {
      // delete the entire code
      setOtpCode([""]);
    }
    if (event.nativeEvent.key !== "Backspace" && index === 5) {
      const updatedOtpCode = [...otpCode];
      updatedOtpCode[index] = "";
      setOtpCode(updatedOtpCode);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const handleVerification = async () => {
    try {
      setIsLoading(true);
      const { error, data: session } = await supabase.auth.verifyOtp({
        phone: `+254${phoneNumber}`,
        token: otpCode.join(""),
        type: "sms",
        options: { redirectTo: `/home` },
      });
      if (session) {
        navigation.replace("/home");
        setIsLoading(false);
      }
      if (error) {
        Toast.show(error.message, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          textColor: "red",
          delay: 0,
        });
        setIsLoading(false);
      }
    } catch (error) {
      Toast.show("An error occured. Try again", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        textColor: "red",
        delay: 0,
      });
    }
  };

  return (
    <SafeAreaView className="flex-1  bg-white ">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar />

      <View className="mt-16 flex h-full w-full flex-[70%] p-7">
        <Text className="my-5 text-2xl font-semibold text-slate-700 ">
          Confirm your phone number
        </Text>
        <Text className="mb-5">
          Please enter the code we have sent to 0{phoneNumber}
        </Text>

        <View className="my-5 flex w-full flex-row gap-x-3">
          {Array(rightOptLength)
            .fill(0)
            .map((_, i) => (
              <TextInput
                ref={i === 0 ? textInput : null}
                key={i}
                className=" h-fit  w-12 border-b-2 border-teal-500  px-2 py-3 text-2xl"
                keyboardType="numeric"
                maxLength={i === 0 ? 6 : 1}
                onKeyPress={(e) => handleDeleteKeyPress(e, i)}
                onChangeText={(text) =>
                  i === 0
                    ? handlePasteFromClipboard(text)
                    : handleOtpInputChange(i, text)
                }
                value={otpCode[i] || ""}
              />
            ))}
        </View>
        <Pressable
          disabled={isLoading}
          onPress={handleVerification}
          className="my-5 flex w-full flex-row items-center justify-around rounded-md bg-teal-400 py-3 "
          android_ripple={{ color: "rgb(20 184 166 )", radius: 40 }}
        >
          <Text className="text-center text-lg text-white">
            {isLoading ? "Verifying" : "Verify OTP"}
          </Text>
          {isLoading && <LoadingDots color="white" size={10} />}
        </Pressable>
      </View>
      <View className="absolute  bottom-5 flex w-full flex-[30%]   flex-row items-baseline justify-between p-7">
        <Pressable onPress={() => navigation.back()}>
          <Text className="text-lg text-sky-500">Change number</Text>
        </Pressable>
        {!isResendDisabled && (
          <TouchableOpacity
            onPress={handleResendOTP}
            className={` flex items-center rounded-md bg-teal-400 px-5 py-3`}
          >
            <Text>Resend code</Text>
          </TouchableOpacity>
        )}

        {isResendDisabled && (
          <Text className="text-lg">Resend Code in {countdown}s</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Otp;
