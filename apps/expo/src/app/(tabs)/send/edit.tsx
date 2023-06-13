import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, KeyboardAvoidingView, Select } from "native-base";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "~/utils/api";
import useStore from "~/utils/zuztand";
import LoadingDots from "~/components/LoadingDots";
import NoContent from "~/components/NoContent";
import type { ExchangeRate, Payment, Rate } from ".prisma/client";

const ZeCurrencies = z.string();
export type Currencies = z.infer<typeof ZeCurrencies>;

const Form = ({
  paymentToEdit,
}: {
  paymentToEdit: Payment & {
    rate: Rate;
    ExchangeRate: ExchangeRate;
  };
}) => {
  const convertionValidator = z.object({
    local: z.string(),
    foreign: z.string(),
    exchangeRateId: z.string(),
  });

  type Values = z.infer<typeof convertionValidator>;

  const [activeInput, setActiveInput] = useState<"foreign" | "local">();
  const { data: exchangeData } = api.exchange.getLatestRates.useQuery(
    undefined,
    {
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
    },
  );

  const {
    handleSubmit,
    watch,
    setValue,

    control,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(convertionValidator),
    defaultValues: {
      exchangeRateId: paymentToEdit?.exchangeRateId,
      local: paymentToEdit.remittedAmount.toString(),
      foreign: paymentToEdit.sentAmount.toString(),
    },
  });

  const watchForeign = watch("foreign");
  const watchLocal = watch("local");
  const exchangeRateId = watch("exchangeRateId");
  const selectedExchange = exchangeData?.find((e) => e.id === exchangeRateId);
  const selectedExchangeCurrency = selectedExchange?.target;
  const selectedExchangeRate = selectedExchange?.Rate.at(0)?.value ?? 0;
  const selectedExchangeRateId = selectedExchange?.Rate.at(0)?.id;
  const foreignInputRef = useRef<TextInput>(null);
  useEffect(() => {
    foreignInputRef.current?.focus();
  }, []);

  function handleForeignChange(value: string) {
    const localValue = Number.isNaN(parseFloat(value) * selectedExchangeRate)
      ? 0
      : parseFloat(value) * selectedExchangeRate;
    setValue("local", localValue.toFixed(2).toString());
    setActiveInput("foreign");
  }

  function handleLocalChange(value: string) {
    const foreignValue = Number.isNaN(parseFloat(value) / selectedExchangeRate)
      ? 0
      : parseFloat(value) / selectedExchangeRate;
    setValue("foreign", foreignValue.toFixed(2).toString());
    setActiveInput("local");
  }

  //check if currency changes to update local currency
  useEffect(() => {
    const localValue = Number.isNaN(
      parseFloat(watchForeign) * selectedExchangeRate,
    )
      ? 0
      : parseFloat(watchForeign) * selectedExchangeRate;
    setValue("local", localValue.toFixed(2).toString());
    setActiveInput("foreign");
  }, [selectedExchangeRate]);
  const router = useRouter();
  const setPayment = useStore((state) => state.setNewPayment);
  const { mutate: editPayment, isLoading } = api.payment.edit.useMutation({
    onSuccess(payment) {
      setPayment(payment);
      router.push(`recipients/confirmation`);
    },
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
  const onSubmit = (data: Values) => {
    {
      selectedExchangeRateId &&
        editPayment({
          ...data,
          rateId: selectedExchangeRateId,
          id: paymentToEdit.id,
        });
    }
  };

  return (
    <View className="flex-1">
      <View className="my-2  flex  h-full w-full  flex-col ">
        <Text className="mb-2 text-lg text-slate-700">
          Select the currency you want to send
        </Text>
        <View className="mt-2 flex  w-full  items-center justify-between">
          <Controller
            control={control}
            name="exchangeRateId"
            render={({ field: { onChange, value } }) => (
              <Select
                selectedValue={value}
                width="100%"
                className="block w-full  rounded-lg  border-gray-300 px-4 py-3.5 text-base"
                accessibilityLabel="Choose Currency"
                placeholder="Choose Currency"
                _selectedItem={{
                  bg: "green.400",

                  endIcon: <CheckIcon size="25" />,
                }}
                mt={1}
                onValueChange={(itemValue) => {
                  onChange(itemValue);
                }}
              >
                {exchangeData?.map((rate) => (
                  <Select.Item
                    label={rate.target}
                    value={rate.id}
                    key={rate.id}
                  />
                ))}
              </Select>
            )}
          />
        </View>
        <Text className=" mb-2 mt-10 text-lg text-slate-700">
          Recipient will receive:
        </Text>
        {errors.foreign && (
          <Text className=" mb-2 text-lg text-red-500">
            {errors.foreign.message}
          </Text>
        )}
        <View className=" mb-10 flex h-fit w-full flex-row  items-start justify-between  border-b border-gray-300 focus:border-green-500 focus:ring-green-500">
          <View className="flex flex-row  items-center  justify-center rounded-lg bg-white  px-4 py-4">
            <Text className="text-xl text-slate-700">
              {selectedExchangeCurrency}{" "}
            </Text>
          </View>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                ref={foreignInputRef}
                keyboardType="numeric"
                value={activeInput === "foreign" ? value : watchForeign}
                onChangeText={(value) => {
                  onChange(value);
                  handleForeignChange(value);
                }}
                className=" block w-2/3 rounded-md   px-4  py-3 text-2xl"
              />
            )}
            name="foreign"
          />
        </View>
        <Text className=" mb-2 text-lg text-slate-700">You will send:</Text>
        {errors.local && (
          <Text className=" mb-2 text-lg text-red-500">
            {errors.local.message}
          </Text>
        )}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? -64 : -32}
          className=" mb-10 flex h-fit w-full flex-row  items-start justify-between  border-b border-gray-300 focus:border-green-500 focus:ring-green-500"
        >
          <View className="flex flex-row  items-center  justify-center rounded-lg bg-white  px-4 py-4">
            <Text className="text-xl text-slate-700"> 🇰🇪 KES</Text>
          </View>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                keyboardType="numeric"
                onBlur={onBlur}
                value={activeInput === "local" ? value : watchLocal}
                onChangeText={(value) => {
                  onChange(value);
                  handleLocalChange(value);
                }}
                className=" block w-2/3 rounded-md   px-4  py-3 text-2xl"
              />
            )}
            name="local"
          />
        </KeyboardAvoidingView>

        <TouchableOpacity
          className={`absolute bottom-5   flex w-full items-center justify-center rounded-lg ${
            isLoading ? "bg-slate-400" : " bg-teal-400"
          } px-4 py-3 shadow-xl`}
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-lg text-white" disabled={isLoading}>
            {isLoading ? (
              <View className="flex h-full w-full items-center justify-between">
                <Text>Loading</Text>
                <LoadingDots size={10} color="rgb(45 212 191)" />
              </View>
            ) : (
              "Continue"
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Index = () => {
  const paymentToEdit = useStore((state) => state.currentPayment);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar />
      <Stack.Screen options={{ headerShown: false }} />

      <View className="h-full w-full">
        <View className="flex h-full w-full items-center justify-center  p-7">
          <View className="h-full w-full max-w-md">
            {paymentToEdit && <Form paymentToEdit={paymentToEdit} />}
            {!paymentToEdit && <NoContent content="payment" />}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Index;
