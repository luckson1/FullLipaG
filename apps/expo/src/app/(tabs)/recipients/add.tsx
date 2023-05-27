import { zodResolver } from "@hookform/resolvers/zod";
import {  Tabs, useRouter } from "expo-router";
import { CheckIcon, KeyboardAvoidingView, Select } from "native-base";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, View , Text, TextInput} from "react-native";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native";
import { ScrollView } from "react-native";
import { z } from "zod";

const RecipientForm = () => {
  enum Country {
    Singapore = "Singapore",
    China = "China",
    HongKong = "Hong Kong",
  }
  const convertionValidator = z.object({
    company: z
      .string({ errorMap: () => ({ message: "Recipient Bank Required!" }) })
      .nonempty("Recipient's Name Required!"),
    bank: z
      .string({ errorMap: () => ({ message: "Bank Name Required!" }) })
      .nonempty("Recipient's Bank Required!"),
    swiftCode: z
      .string({ errorMap: () => ({ message: "Bank's Swift Code Required!" }) })
      .nonempty("Bank's Swift Code Required!"),
    account: z
      .string({ errorMap: () => ({ message: "Account Required!" }) })
      .nonempty("Account Required!"),
    country: z.nativeEnum(Country, {
      errorMap: () => ({
        message: "Select valid Country where the bank is located!",
      }),
    }),
  });
  type Values = z.infer<typeof convertionValidator>;
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(convertionValidator),
  });
  const router = useRouter();
  const onSubmit = (data: Values) => {
    console.log(data); router.push("/recipients/confirmation")
  };

  return (
    
    <ScrollView className="flex-1 bg-white">
      <Tabs.Screen     options={{href:null}} />
    
  <SafeAreaView className="w-full flex justify-center items-center ">
  <View className="items-between flex w-full flex-col justify-between gap-y-5 p-5 max-w-md">
        <View
          className="flex  flex-row w-full items-center justify-between"
      
        >
          <Text className="text-xl">Recipient&apos;s Bank Details</Text>
        
        </View>

        <View className=" flex w-full items-start justify-between ">
          <Text className=" mb-2 text-slate-700">Recipient Company Name</Text>
          {errors.company && (
            <Text className=" mb-2 text-red-500">
              {" "}
              {errors.company.message}
            </Text>
          )}
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                className= {`block w-full rounded-md border  px-4 py-3 ${errors.company? "border-red-500  focus:border-green-500 focus:ring-green-500": " border-gray-300  focus:border-green-500 focus:ring-green-500"}`}
                value={value}
              />
            )}
            name="company"
          />
        </View>

        <View className=" flex w-full  items-start justify-between ">
          <Text className=" mb-2 text-slate-700">
            Recipient&apos;s Bank Name
          </Text>
          {errors.bank && (
            <Text className=" mb-2 text-red-500">{errors.bank.message}</Text>
          )}
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                    className= {`block w-full rounded-md border  px-4 py-3 ${errors.bank? "border-red-500  focus:border-green-500 focus:ring-green-500": " border-gray-300  focus:border-green-500 focus:ring-green-500"}`}
                value={value}
              />
            )}
            name="bank"
          />
  </View>
          <View className=" mt-4 flex w-full items-start justify-between">
            <Text className=" mb-2 text-slate-700">
              Country where bank is located
            </Text>
            {errors.country && (
              <Text className=" mb-2 text-red-500">
                {errors.country.message}
              </Text>
            )}
            <Controller
              control={control}
              name="country"
              render={({ field: { onChange, value } }) => (
                <Select
                  selectedValue={value}
                  width="100%"
                  className="block w-full rounded-md border-gray-300  px-4 py-3 text-base"
                  accessibilityLabel="Choose Country"
                  placeholder="Choose Country"
                  _selectedItem={{
                    bg: "green.400",

                    endIcon: <CheckIcon size="25" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) => onChange(itemValue)}
                >
                  <Select.Item label="China" value={Country.China} />
                  <Select.Item label="Singapore" value={Country.Singapore} />
                  <Select.Item label="Hong Kong" value={Country.HongKong} />
                </Select>
              )}
            />
          </View>
      
        <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className=" flex w-full  items-start justify-between " keyboardVerticalOffset={Platform.OS==="ios"? -200: -100} >
          <Text className=" mb-2 text-slate-700">Banks&apos;s Swift Code</Text>
          {errors.swiftCode && (
            <Text className=" mb-2 text-red-500">
              {errors.swiftCode.message}
            </Text>
          )}
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                    className= {`block w-full rounded-md border  px-4 py-3 ${errors.swiftCode? "border-red-500  focus:border-green-500 focus:ring-green-500": " border-gray-300  focus:border-green-500 focus:ring-green-500"}`}
                value={value}
              />
            )}
            name="swiftCode"
          />
        </KeyboardAvoidingView>
        <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className=" flex w-full  items-start justify-between " keyboardVerticalOffset={Platform.OS==="ios"? -64: -32}>
          <Text className=" mb-2 text-slate-700">Account of Recipient</Text>
          {errors.account && (
            <Text className=" mb-2 text-red-500">{errors.account.message}</Text>
          )}
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                    className= {`block w-full rounded-md border  px-4 py-3 ${errors.account? "border-red-500  focus:border-green-500 focus:ring-green-500": " border-gray-300  focus:border-green-500 focus:ring-green-500"}`}
                value={value}
              />
            )}
            name="account"
          />
        </KeyboardAvoidingView>

        <View className="w-full">
          <TouchableOpacity
            className="my-2 flex w-full   items-center justify-center rounded-lg bg-green-400 px-4 py-3 shadow-xl"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-xl font-bold text-white">Add Recipient</Text>
          </TouchableOpacity>
        </View>
      </View>
  </SafeAreaView>

    </ScrollView>
  );
};

export default RecipientForm