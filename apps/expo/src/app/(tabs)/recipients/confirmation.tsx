import { SafeAreaView, ScrollView, Text, TouchableOpacity } from "react-native";
import Toast from "react-native-root-toast";
import { useRouter } from "expo-router";
import { View } from "native-base";

import { api } from "~/utils/api";
import useStore from "~/utils/zuztand";

const Confirmation = () => {
  const router = useRouter();
  const [currentPayment, currentRecipient, clearRecipient, clearPayment] =
    useStore((state) => [
      state.currentPayment,
      state.currentRecipient,
      state.clearRecipient,
      state.clearPayment,
    ]);
  const ctx = api.useContext();
  const { mutate: addTransaction } = api.transaction.add.useMutation({
    async onSuccess(transaction) {
      clearPayment();
      clearRecipient();
      await ctx.transaction.invalidate();
      router.push(`/transactions/id?id=${transaction.id}`);
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
  return (
    <ScrollView className="flex-1 bg-white">
      <SafeAreaView className="flex w-full flex-col items-center justify-between  p-5">
        <View className=" my-5 w-full rounded-xl border border-green-300 bg-green-50 bg-opacity-5 py-3 shadow-xl">
          <Text className=" mx-5 text-xl font-bold">
            {currentRecipient?.name}&apos;s Details
          </Text>
          <View className="flex w-full flex-row justify-between px-5 py-3">
            <Text className="text-start">Bank</Text>
            <Text className="text-end"> {currentRecipient?.bankName}</Text>
          </View>
          <View className="flex w-full flex-row justify-between px-5 py-3">
            <Text className="text-start">Country</Text>
            <Text className="text-end"> {currentRecipient?.bankCountry}</Text>
          </View>
          <View className="flex w-full flex-row justify-between px-5 py-3">
            <Text className="text-start">Swift Code</Text>
            <Text className="text-end"> {currentRecipient?.swiftCode}</Text>
          </View>
          <View className="flex w-full flex-row justify-between px-5 py-3">
            <Text className="text-start">Bank Account</Text>
            <Text className="text-end"> {currentRecipient?.bankAccount}</Text>
          </View>
        </View>
        <View className=" my-5 w-full rounded-xl border border-green-300  bg-green-50 bg-opacity-5 py-3 shadow-xl">
          <Text className=" mx-5 text-xl font-bold">
            Transfer Details Details
          </Text>
          <View className="flex w-full flex-row justify-between px-5 py-3">
            <Text className="text-start">The Recipient Gets:</Text>
            <Text className="text-end">
              {" "}
              {currentPayment?.ExchangeRate.target} {currentPayment?.sentAmount}
            </Text>
          </View>
          <View className="flex w-full flex-row justify-between px-5 py-3">
            <Text className="text-start">You Send:</Text>
            <Text className="text-end">
              {currentPayment?.ExchangeRate.source}{" "}
              {currentPayment?.remittedAmount}
            </Text>
          </View>
          <View className="flex w-full flex-row justify-between px-5 py-3">
            <Text className="text-start">Exchange Rate:</Text>
            <Text className="text-end">
              {" "}
              {currentPayment?.ExchangeRate.target} ={" "}
              {currentPayment?.rate.value} {currentPayment?.ExchangeRate.source}
            </Text>
          </View>
        </View>
        <View className="my-5 w-full">
          <TouchableOpacity
            className="my-2 flex w-full   items-center justify-center rounded-lg bg-green-400 px-4 py-3 shadow-xl"
            onPress={() =>
              addTransaction({
                status: "Initiated",
                recipientId: currentRecipient?.id ?? "",
                paymentId: currentPayment?.id ?? "",
                paymentMethod: "Manual_wire_transfer",
              })
            }
          >
            <Text className="text-xl font-bold text-white">Confirm</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Confirmation;
