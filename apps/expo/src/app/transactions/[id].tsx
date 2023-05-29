import React, { useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Divider } from "@rneui/base";
import { Icon } from "@rneui/themed";

import { api } from "~/utils/api";
import useStore from "~/utils/zuztand";
import LoadingComponent from "~/components/LoadingComponent";
import { type Transaction } from ".prisma/client";

type ModalType = "paymentMethod" | "bankPolicy" | "transferInfo";
const BankPolicy = ({
  setIsShowModal,
}: {
  setIsShowModal: React.Dispatch<React.SetStateAction<ModalType>>;
}) => {
  const paymentMethod = useStore((state) => state.paymentMethod);
  return (
    <SafeAreaView className="flex flex-1 flex-col items-start justify-start  p-5">
      <View className="my-10 mt-5 flex w-full  flex-row items-center justify-between px-3">
        <TouchableOpacity
          className="rounded-full p-2"
          onPress={() => setIsShowModal("paymentMethod")}
        >
          <Icon
            name="arrow-left"
            type="font-awesome"
            size={30}
            color={"gray"}
          />
        </TouchableOpacity>
        <Text className="text-xl">How to make the payment?</Text>
      </View>

      <View className="my-5 flex w-full flex-row items-center justify-center gap-x-3">
        <Icon name="description" type="material" size={40} color={"grey"} />
        <Text className="w-[80%] text-lg text-slate-700">
          We will give you our bank details
        </Text>
      </View>
      <View className="my-5 flex w-full flex-row items-center justify-center gap-x-3">
        <Icon
          name="account-balance"
          type="material"
          size={40}
          color={"white"}
          backgroundColor={"#9700b9"}
          borderRadius={10}
        />
        <Text className="w-[80%] text-lg text-slate-700">
          Make a {paymentMethod} Transfer from your account to our bank account
        </Text>
      </View>
      <View className="my-5 flex w-full flex-row items-center justify-center gap-x-3">
        <Icon
          name="check"
          type="material"
          size={40}
          color={"white"}
          backgroundColor={"#4ade80"}
          borderRadius={10}
        />
        <Text className="w-[80%] text-lg text-slate-700">
          Get the bank reference number after sending us the funds, to confirm
          the payment
        </Text>
      </View>
      <View className="my-5 flex w-full flex-row items-center justify-center gap-x-3 ">
        <Icon
          name="arrow-upward"
          type="material"
          size={40}
          color={"white"}
          backgroundColor={"#4ade80"}
          borderRadius={10}
        />
        <Text className="w-[80%] text-lg text-slate-700">
          Once we confirm the receipt of the funds, we will send it to the
          recipient
        </Text>
      </View>

      <TouchableOpacity
        className="flex w-full items-center justify-center rounded-lg bg-green-400 py-3 "
        onPress={() => setIsShowModal("transferInfo")}
      >
        <Text className="text-lg text-white"> Understood</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const TransferInfo = ({
  setIsShowModal,
  transaction,
}: {
  setIsShowModal: React.Dispatch<React.SetStateAction<ModalType>>;
  transaction: Transaction;
}) => {
  const router = useRouter();
  const [paymentMethod, clearPaymentMethod] = useStore((state) => [
    state.paymentMethod,
    state.clearPayment,
  ]);
  return (
    <ScrollView className="flex-1">
      <SafeAreaView className="flex flex-1 flex-col items-start justify-center  p-8">
        <View className="mt-5  flex w-full  flex-row items-center justify-between ">
          <TouchableOpacity
            className="rounded-full p-2"
            onPress={() => {
              setIsShowModal("bankPolicy");
            }}
          >
            <AntDesign name="arrowleft" size={30} color={"gray"} />
          </TouchableOpacity>
          <Text className="text-xl">
            Pay by making a {paymentMethod} bank transfer
          </Text>
        </View>

        <View className="flex w-full items-center justify-center border-b-2 border-slate-400 py-3">
          <View className="my-4 h-48 w-full items-start justify-between rounded-xl bg-slate-100 p-5 shadow">
            <View className="flex w-full items-center justify-center">
              <Icon name="info" size={48} type="material" color={"#0ea5e9"} />
            </View>

            <Text>
              1. Make a {paymentMethod} transfer to the accounts below:
            </Text>
            <Text>2. Get the Bank Reference Number</Text>
          </View>
          <Text>Bank Transfer Instructions</Text>
        </View>
        <View className="my-4 flex">
          <Text className="text-thin">Payee Name</Text>
          <Text className="text-xl">Lipa Global Ltd</Text>
        </View>
        <View className="my-4 flex">
          <Text className="text-thin">Bank Name</Text>
          <Text className="text-xl">Equity Bank Kenya</Text>
        </View>
        <View className="my-4 flex">
          <Text className="text-thin">Account Number</Text>
          <Text className="text-xl">0160196743780</Text>
        </View>
        <View className="my-4 flex">
          <Text className="text-thin">Bank Branch</Text>
          <Text className="text-xl">Canva Corporate Branch</Text>
        </View>
        <View className="my-4 flex">
          <Text className="text-thin">Bank Branch</Text>
          <Text className="text-xl">Canva Corporate Branch</Text>
        </View>

        <View className="my-4 flex w-full gap-y-4">
          <TouchableOpacity
            className="flex w-full items-center justify-center rounded-lg bg-green-400 py-3 "
            onPress={() => {
              router.push(`/transactions/overview/id?id=${transaction.id}`);
              clearPaymentMethod();
            }}
          >
            <Text className="text-lg text-white">I have made the transfer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex w-full items-center justify-center rounded-lg border border-green-400 bg-inherit py-3"
            onPress={() => {
              router.push(`/transactions/overview/id?id=${transaction.id}`);
              clearPaymentMethod();
            }}
          >
            <Text className=" text-lg"> I will make the transfer later</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex w-full items-center justify-center rounded-lg border border-green-400 bg-inherit py-3">
            <Text className=" text-lg"> I need help</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const PaymentMethod = ({
  setIsShowModal,
  transaction,
}: {
  setIsShowModal: React.Dispatch<React.SetStateAction<ModalType>>;
  transaction: Transaction;
}) => {
  const router = useRouter();
  const [isSelected, setIsSelected] = useState<
    "M-pesa" | "pesaLink" | "Manual"
  >();
  const { mutate: editTransaction } = api.transaction.edit.useMutation({
    onSuccess: () => setIsShowModal("bankPolicy"),
    onError(error) {
      Toast.show(`An Error Occured: ${error.message}`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        textColor: "red",
        delay: 0,
      });
    },
  });
  const setPaymentMethod = useStore((state) => state.setNewPaymentMethod);
  return (
    <ScrollView className="flex-1">
      <SafeAreaView className="flex w-full flex-col items-center justify-between  p-5">
        <View className="my-5 flex w-full  flex-row items-center justify-between px-3">
          <TouchableOpacity
            className="rounded-full p-2"
            onPress={() => router.back()}
          >
            <AntDesign name="arrowleft" size={30} color={"gray"} />
          </TouchableOpacity>
          <Text className="text-xl">How do you want to pay?</Text>
        </View>

        <TouchableOpacity
          className={`mt-5 flex w-full items-center justify-center   py-5 shadow-lg shadow-green-400/100 `}
        >
          <View className=" w-full gap-y-3">
            <Divider />
            <Text className="  text-xl">Mpesa (coming soon)</Text>

            <View className="flex w-full flex-row items-center justify-between">
              <View className="w-1/6">
                <Icon
                  name="mobile"
                  type="font-awesome"
                  size={64}
                  color={"#22c55e"}
                />
              </View>
              <View className="w-2/3">
                <Text className="w-full leading-loose tracking-wide text-slate-600 ">
                  Send the money to our Pay Bill number. Suitable for amounts
                  less than Ksh. 140,000
                </Text>
              </View>

              <View className="w-1/6">
                <Icon
                  name="arrow-right"
                  type="material"
                  size={64}
                  color={"#4ade80"}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className={`mt-5 flex w-full items-center justify-center   py-5 shadow-lg shadow-green-400/100 ${
            isSelected === "pesaLink" ? "bg-green-50" : ""
          }`}
          onPress={() => {
            editTransaction({
              ...transaction,
              status: "To_Confirm",
              paymentMethod: "PesaLink",
            });
            setPaymentMethod("pesaLink");
            setIsSelected("pesaLink");
          }}
        >
          <View className="w-full gap-y-3">
            <Divider />
            <Text className="  text-xl">PesaLink</Text>

            <View className="flex w-full flex-row items-center justify-between">
              <View className="w-1/6">
                <Icon
                  name="mobile"
                  type="font-awesome"
                  size={64}
                  color={"#0ea5e9"}
                />
              </View>
              <View className="w-2/3">
                <Text className="w-full leading-loose tracking-wide text-slate-600 ">
                  Send the money to us using PesaLink. Suitable for amounts less
                  than Ksh. 1,000,000
                </Text>
              </View>
              <View className="w-1/6">
                <Icon
                  name="arrow-right"
                  type="simple-line-icons"
                  size={64}
                  color={"#4ade80"}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className={`mt-5 flex w-full items-center justify-center   py-5 shadow-lg shadow-green-400/100 ${
            isSelected === "Manual" ? "bg-green-50" : ""
          }`}
          onPress={() => {
            editTransaction({ ...transaction, status: "To_Confirm" });
            setPaymentMethod("Manual");
            setIsSelected("Manual");
          }}
        >
          <View className="w-full gap-y-3">
            <Divider />
            <Text className="  text-xl">Manual Bank Transfer</Text>

            <View className="flex flex-row items-center justify-between">
              <View className="w-1/6">
                <Icon
                  name="account-balance"
                  type="material"
                  size={40}
                  color={"#9700b9"}
                />
              </View>
              <View className="w-2/3">
                <Text className="w-full leading-loose tracking-wide text-slate-600 ">
                  Manually send the money to ust using your Bank. Suitable for
                  amounts more than Ksh. 1,000,000
                </Text>
              </View>
              <View className="w-1/6">
                <Icon
                  name="arrow-right"
                  type="simple-line-icons"
                  size={64}
                  color={"#4ade80"}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
};

const TransactionId = () => {
  <Stack.Screen options={{ headerShown: false }} />;

  const [isShowModal, setIsShowModal] = useState<ModalType>("paymentMethod");
  const params = useSearchParams();
  const id = params.id as string;
  const {
    data: transaction,
    isError,
    isLoading,
  } = api.transaction.getUsersOne.useQuery(
    { id },
    {
      onError(error) {
        Toast.show(`An Error Occured: ${error.message}`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          textColor: "red",
          delay: 0,
        });
      },
    },
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {isLoading && !isError && (
        <View className="flex h-full w-full items-center justify-center bg-teal-500">
          <LoadingComponent />
        </View>
      )}
      {transaction && (
        <View className=" h-full w-full">
          <Modal
            visible={isShowModal === "paymentMethod"}
            animationType="slide"
          >
            <PaymentMethod
              setIsShowModal={setIsShowModal}
              transaction={transaction}
            />
          </Modal>
          <Modal visible={isShowModal === "bankPolicy"} animationType="slide">
            <BankPolicy setIsShowModal={setIsShowModal} />
          </Modal>
          <Modal visible={isShowModal === "transferInfo"} animationType="slide">
            <TransferInfo
              setIsShowModal={setIsShowModal}
              transaction={transaction}
            />
          </Modal>
        </View>
      )}
    </SafeAreaView>
  );
};

export default TransactionId;
