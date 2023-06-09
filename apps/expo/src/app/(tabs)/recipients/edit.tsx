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
import { Stack, useRouter, useSearchParams } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, KeyboardAvoidingView, Select } from "native-base";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "~/utils/api";
import useStore from "~/utils/zuztand";
import LoadingDots from "~/components/LoadingDots";
import NoContent from "~/components/NoContent";

const EditRecipientForm = ({ id }: { id: string }) => {
  const convertionValidator = z.object({
    name: z
      .string({ errorMap: () => ({ message: "Recipient Bank Required!" }) })
      .nonempty("Recipient's Name Required!"),
    bankName: z
      .string({ errorMap: () => ({ message: "Bank Name Required!" }) })
      .nonempty("Recipient's Bank Name Required!"),
    swiftCode: z
      .string({ errorMap: () => ({ message: "Bank's Swift Code Required!" }) })
      .nonempty("Bank's Swift Code Required!"),
    bankAccount: z
      .string({ errorMap: () => ({ message: "Account Required!" }) })
      .nonempty("Account Required!"),
    bankCountry: z
      .string({ errorMap: () => ({ message: "Country Required!" }) })
      .nonempty("Recipient's bank country Required!"),
  });
  type Values = z.infer<typeof convertionValidator>;
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(convertionValidator),
    defaultValues: {
      name: "",
      bankName: "",
      swiftCode: "",
      bankAccount: "",
      bankCountry: "China",
    },
  });
  const router = useRouter();
  const { data: recipient } = api.recipient.getUsersOne.useQuery(
    { id },
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
      onSuccess: (recipient) => {
        reset({ ...recipient });
      },
    },
  );
  const [storeRecipient, currentPayment] = useStore((store) => [
    store.setNewRecipient,
    store.currentPayment,
  ]);
  const ctx = api.useContext();
  const isPaymentInProgress = currentPayment !== undefined;
  const { mutate: editRecipient, isLoading } = api.recipient.edit.useMutation({
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
    editRecipient({ ...data, id });
  };
  return (
    <ScrollView className="flex-1 bg-white">
      <Stack.Screen options={{ title: "Recipient's Bank Details" }} />

      <SafeAreaView className="flex w-full items-center justify-center ">
        <View className="items-between flex w-full max-w-md flex-col justify-between gap-y-5 p-5">
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
                  className={`block w-full rounded-md border  bg-slate-50 bg-opacity-10 px-4 py-3 ${
                    errors.name
                      ? "border-red-500 focus:border-green-300 focus:ring-green-300"
                      : " border-gray-300  focus:border-green-500 focus:ring-green-300"
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
                  className={`block w-full rounded-md border bg-slate-50 bg-opacity-5  px-4 py-3 ${
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
                  className="block w-full rounded-md border-gray-300 bg-slate-50 bg-opacity-10  px-4 py-3 text-base"
                  accessibilityLabel="Choose Country"
                  placeholder="Choose Country"
                  _selectedItem={{
                    bg: "green.400",

                    endIcon: <CheckIcon size="25" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) => onChange(itemValue)}
                >
                  <Select.Item label="China" value="China" />
                  <Select.Item label="Singapore" value={"Singapore"} />
                  <Select.Item label="Hong Kong" value={"HongKong"} />
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
                  className={`block w-full rounded-md border bg-slate-50 bg-opacity-10  px-4 py-3 ${
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
                  className={`block w-full rounded-md border bg-slate-50 bg-opacity-10  px-4 py-3 ${
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
              className={`my-5 flex  w-full flex-row items-center justify-around rounded-lg ${
                isLoading ? "bg-slate-300" : " bg-teal-400"
              } px-4 py-3 shadow-xl`}
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="text-xl font-bold text-white">
                {isLoading ? "Saving" : "Save"}
              </Text>
              {isLoading && <LoadingDots color="white" size={10} />}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const Edit = () => {
  const params = useSearchParams();

  const id = params.recipientId;

  return (
    <View className="flex-1">
      {id && typeof id === "string" && <EditRecipientForm id={id} />}
      {!id ||
        (typeof id !== "string" && (
          <View className="flex items-center justify-center">
            <NoContent content="recipient" />
          </View>
        ))}
    </View>
  );
};

export default Edit;
