import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, KeyboardAvoidingView, Select } from "native-base";
import { Platform } from "react-native";

const ZeCurrencies = z.enum(["USD", "JPY", "CNY"]);
export type Currencies = z.infer<typeof ZeCurrencies>;

const Form = () => {
  const regexPattern = /^\d+(\.\d+)?$/;
  const convertionValidator = z.object({
    local: z.string().regex(regexPattern, { message: "Enter a Valid amount" }),
    foreign: z
      .string()
      .regex(regexPattern, { message: "Enter a Valid amount" }),
      currency: z.enum(["USD", "JPY", "CNY"])
  });


  type Values = z.infer<typeof convertionValidator>;

  const [activeInput, setActiveInput]=useState<'foreign' | 'local'>()
  const {
    handleSubmit,
    watch,
    setValue,
    control,
    resetField,
    setFocus,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(convertionValidator),
    defaultValues:{
      currency: "USD"
    }
  });

  const watchForeign = watch('foreign');
  const watchLocal = watch('local');
  const currency=watch('currency')
  const conversion= currency==="USD"? 141 : currency==="CNY" ? 20.6 : currency==="JPY" ? 1.1 : 0
  function handleForeignChange(value:string) {
    const localValue = Number.isNaN(parseFloat(value) * conversion)? 0: parseFloat(value) * conversion;
    setValue('local', localValue.toFixed(2).toString());
    setActiveInput('foreign');
  }

  function handleLocalChange(value:string) {
    const foreignValue =Number.isNaN( parseFloat(value) / conversion) ? 0: parseFloat(value) / conversion;
    setValue('foreign', foreignValue.toFixed(2).toString());
    setActiveInput('local');
  }

  //check if currency changes to update local currency
  useEffect(()=>{
    const conversion= currency==="USD"? 141 : currency==="CNY" ? 20.6 : currency==="JPY" ? 1.1 : 0
      const localValue = Number.isNaN(parseFloat(watchForeign) * conversion)? 0: parseFloat(watchForeign) * conversion;
      setValue('local', localValue.toFixed(2).toString());
      setActiveInput('foreign');
    console.log(currency)
  },[currency])
  const router = useRouter();
  const onSubmit = (data: Values) => {
    router.push(`recipients?local=${data.local}&foreign=${data.foreign}`);
  };

  return (
    <View className="my-2  flex  w-full flex-col  ">
            <Text className="text-lg text-slate-700 mb-2">
            Select the currency you want to send
          </Text>
          <View className="mt-2 flex  w-full  items-center justify-between">
          <Controller
              control={control}
              name="currency"
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
                onValueChange={(itemValue) => {onChange(itemValue)}}
              >
                <Select.Item label=" 🇺🇸 USD" value={"USD"} />
                <Select.Item label=" 🇨🇳 CNY" value={"CNY"} />
                <Select.Item label=" 🇯🇵 JPY" value={"JPY"} />
              </Select>
              )}
            />
         
          </View>
      <Text className=" mb-2 mt-10 text-lg text-slate-700">
        Recipient will receive:
      </Text>
    { errors.foreign && <Text className=" mb-2 text-lg text-red-500">
      {errors.foreign.message}
      </Text>}
      <View className=" mb-10 flex h-fit w-full flex-row  items-start justify-between rounded-md border border-gray-300 focus:border-green-500 focus:ring-green-500">
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              keyboardType="numeric"
              value={activeInput === 'foreign' ? value : watchForeign}
              onChangeText={(value) => {
                onChange(value);
                handleForeignChange(value);
              }}
              className=" block w-2/3 rounded-md   px-4  py-3"
              
            />
          )}
          name="foreign"
        />
        <View className="flex flex-row  items-center  justify-center rounded-lg bg-white  px-4 py-4">
          <Text className="text-slate-700">
            {currency === "USD"
              ? "USD  🇺🇸"
              : currency === "JPY"
              ? "JPY 🇯🇵"
              : "CNY  🇨🇳 "}{" "}
          </Text>
        </View>
      </View>
      <Text className=" mb-2 text-lg text-slate-700">You will send:</Text>
      { errors.local && <Text className=" mb-2 text-lg text-red-500">
      {errors.local.message}
      </Text>}
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  keyboardVerticalOffset={Platform.OS==="ios"? -64: -32} className=" mb-10 flex h-fit w-full flex-row  items-start justify-between rounded-md border border-gray-300 focus:border-green-500 focus:ring-green-500">
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              keyboardType="numeric"
              onBlur={onBlur}
              value={activeInput === 'local' ? value : watchLocal}
              onChangeText={(value) => {
                onChange(value);
                handleLocalChange(value);
              }}
              className=" block w-2/3 rounded-md   px-4  py-3"
         
            />
          )}
          name="local"
        />
        <View className="flex flex-row  items-center  justify-center rounded-lg bg-white  px-4 py-4">
          <Text className="text-slate-700">KES 🇰🇪 </Text>
        </View>
      </KeyboardAvoidingView>

      <TouchableOpacity
        className="mt-8 flex w-full   items-center justify-center rounded-lg bg-green-400 shadow-xl px-4 py-3"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-lg text-white">Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const Index = () => {
 
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView className="w-full ">
       
       <View className="flex justify-center items-center w-full gap-y-10 p-7">
       <View className="w-full max-w-md">
          <Form  />
        </View>
       </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
