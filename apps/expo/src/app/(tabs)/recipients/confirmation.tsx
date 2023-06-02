import { SafeAreaView, ScrollView, Text, TouchableOpacity } from "react-native";
import Toast from "react-native-root-toast";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
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
  const { mutate: addTransaction, isLoading } = api.transaction.add.useMutation(
    {
      async onSuccess(transaction) {
        await ctx.transaction.invalidate();
        router.push(`/transactions/id?id=${transaction.id}`);
        clearPayment();
        clearRecipient();
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
    },
  );
  return (
    <ScrollView className="flex-1 bg-white">
      <SafeAreaView className="flex w-full flex-col items-center justify-between  p-5">
        <View className=" my-3 w-full rounded-xl border border-green-300 bg-green-50 bg-opacity-5 py-3 shadow-xl">
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
          <View className="my-3 flex w-full flex-row items-center justify-around">
            <TouchableOpacity
              className="flex w-20 flex-row items-center justify-around  rounded-md bg-yellow-500 py-2"
              onPress={() => {
                router.push(
                  `/recipients/edit?id=${currentRecipient?.id ?? ""}`,
                );
              }}
            >
              <Text className=" text-sm text-white">Edit</Text>
              <AntDesign name="edit" size={20} color={"white"} />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex flex-row items-center justify-around rounded-md  px-2 py-2"
              onPress={() => {
                router.back();
              }}
            >
              <Text className=" mr-2 text-sky-500">Select new recipient</Text>
              <AntDesign name="right" size={20} color={"rgb(14 165 233)"} />
            </TouchableOpacity>
          </View>
        </View>
        <View className=" my-3 w-full rounded-xl border border-green-300  bg-green-50 bg-opacity-5 py-3 shadow-xl">
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
          <View className="my-3 flex w-full items-start justify-center px-5 py-3 ">
            <TouchableOpacity
              className="flex w-20 flex-row items-center justify-around  rounded-md bg-yellow-500 py-2"
              onPress={() => {
                router.push(`/send/edit?id=${currentPayment?.id ?? ""}`);
              }}
            >
              <Text className=" text-sm text-white">Edit</Text>
              <AntDesign name="edit" size={20} color={"white"} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="my-3 w-full">
          <TouchableOpacity
            disabled={isLoading}
            className={`my-2 flex w-full   items-center justify-center rounded-lg ${
              isLoading ? "bg-slate-500" : " bg-green-400"
            } px-4 py-3 shadow-xl`}
            onPress={() =>
              addTransaction({
                status: "Initiated",
                recipientId: currentRecipient?.id ?? "",
                paymentId: currentPayment?.id ?? "",
                paymentMethod: "Manual_wire_transfer",
              })
            }
          >
            <Text
              className={`text-xl font-bold  ${
                isLoading ? "text-slate-900" : "text-white"
              }`}
            >
              {isLoading ? "Creating transaction ..." : "Confirm"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Confirmation;
