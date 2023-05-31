import {
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { Tabs, useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, KeyboardAvoidingView, Select } from "native-base";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "~/utils/api";
import useStore from "~/utils/zuztand";

const RecipientForm = () => {
  enum Country {
    Singapore = "Singapore",
    China = "China",
    HongKong = "Hong Kong",
  }
  const convertionValidator = z.object({
    name: z
      .string({ errorMap: () => ({ message: "Recipient Bank Required!" }) })
      .nonempty("Recipient's Name Required!"),
    bankName: z
      .string({ errorMap: () => ({ message: "Bank Name Required!" }) })
      .nonempty("Recipient's Bank Required!"),
    swiftCode: z
      .string({ errorMap: () => ({ message: "Bank's Swift Code Required!" }) })
      .nonempty("Bank's Swift Code Required!"),
    bankAccount: z
      .string({ errorMap: () => ({ message: "Account Required!" }) })
      .nonempty("Account Required!"),
    bankCountry: z.nativeEnum(Country, {
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

  const [storeRecipient, currentPayment] = useStore((store) => [
    store.setNewRecipient,
    store.currentPayment,
  ]);
  const ctx = api.useContext();
  const isPaymentInProgress = currentPayment !== undefined;
  const { mutate: addRecipient, isLoading } = api.recipient.add.useMutation({
    onSuccess: isPaymentInProgress
      ? async (recipient) => {
          await ctx.recipient.invalidate();
          storeRecipient(recipient);
          router.push("/recipients/confirmation");
        }
      : async () => {
          await ctx.recipient.invalidate();
          router.push("/recipients");
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
    addRecipient(data);
  };
  return (
    <ScrollView className="flex-1 bg-white">
      <Tabs.Screen options={{ href: null }} />

      <SafeAreaView className="flex w-full items-center justify-center ">
        <View className="items-between flex w-full max-w-md flex-col justify-between gap-y-5 p-5">
          <View className="flex  w-full flex-row items-center justify-between">
            <Text className="text-xl">Recipient&apos;s Bank Details</Text>
          </View>

          <View className=" flex w-full items-start justify-between ">
            <Text className=" mb-2 text-slate-700">Recipient Company Name</Text>
            {errors.name && (
              <Text className=" mb-2 text-red-500"> {errors.name.message}</Text>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  className={`block w-full rounded-md border  px-4 py-3 ${
                    errors.name
                      ? "border-red-500  focus:border-green-500 focus:ring-green-500"
                      : " border-gray-300  focus:border-green-500 focus:ring-green-500"
                  }`}
                  value={value}
                />
              )}
              name="name"
            />
          </View>

          <View className=" flex w-full  items-start justify-between ">
            <Text className=" mb-2 text-slate-700">
              Recipient&apos;s Bank Name
            </Text>
            {errors.bankName && (
              <Text className=" mb-2 text-red-500">
                {errors.bankName.message}
              </Text>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  className={`block w-full rounded-md border  px-4 py-3 ${
                    errors.bankName
                      ? "border-red-500  focus:border-green-500 focus:ring-green-500"
                      : " border-gray-300  focus:border-green-500 focus:ring-green-500"
                  }`}
                  value={value}
                />
              )}
              name="bankName"
            />
          </View>
          <View className=" mt-4 flex w-full items-start justify-between">
            <Text className=" mb-2 text-slate-700">
              Country where bank is located
            </Text>
            {errors.bankCountry && (
              <Text className=" mb-2 text-red-500">
                {errors.bankCountry.message}
              </Text>
            )}
            <Controller
              control={control}
              name="bankCountry"
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
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className=" flex w-full  items-start justify-between "
            keyboardVerticalOffset={Platform.OS === "ios" ? -200 : -100}
          >
            <Text className=" mb-2 text-slate-700">
              Banks&apos;s Swift Code
            </Text>
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
                  className={`block w-full rounded-md border  px-4 py-3 ${
                    errors.swiftCode
                      ? "border-red-500  focus:border-green-500 focus:ring-green-500"
                      : " border-gray-300  focus:border-green-500 focus:ring-green-500"
                  }`}
                  value={value}
                />
              )}
              name="swiftCode"
            />
          </KeyboardAvoidingView>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className=" flex w-full  items-start justify-between "
            keyboardVerticalOffset={Platform.OS === "ios" ? -64 : -32}
          >
            <Text className=" mb-2 text-slate-700">Account of Recipient</Text>
            {errors.bankAccount && (
              <Text className=" mb-2 text-red-500">
                {errors.bankAccount.message}
              </Text>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  className={`block w-full rounded-md border  px-4 py-3 ${
                    errors.bankAccount
                      ? "border-red-500  focus:border-green-500 focus:ring-green-500"
                      : " border-gray-300  focus:border-green-500 focus:ring-green-500"
                  }`}
                  value={value}
                />
              )}
              name="bankAccount"
            />
          </KeyboardAvoidingView>

          <View className="w-full">
            <TouchableOpacity
              disabled={isLoading}
              className={`my-5 flex   w-full items-center justify-center rounded-lg ${
                isLoading ? "bg-slate-300" : " bg-green-400"
              } px-4 py-3 shadow-xl`}
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="text-xl font-bold text-white">
                {isLoading ? "Loading...." : "Add Recipient"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isLoading}
              className="my-2 flex w-full   items-center justify-center rounded-lg border border-green-400 bg-white px-4 py-3 shadow-xl focus:bg-green-400"
              onPress={() => router.back()}
            >
              <Text className="text-xl font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default RecipientForm;
