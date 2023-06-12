import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollView } from "native-base";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "~/utils/api";
import LoadingComponent from "~/components/LoadingComponent";
import NoContent from "~/components/NoContent";
import {
  type ExchangeRate,
  type Payment,
  type Rate,
  type Recipient,
  type Status,
  type Transaction,
} from ".prisma/client";

type ViewState = "tracker" | "overview";
const Tab = ({
  view,
  setView,
}: {
  view: ViewState;
  setView: React.Dispatch<React.SetStateAction<ViewState>>;
}) => {
  return (
    <View className="mx-auto flex h-fit w-full max-w-xl flex-row-reverse items-center justify-between rounded-lg bg-slate-100 p-0.5 text-xs">
      {view === "overview" ? (
        <Pressable
          className=" flex w-6/12  items-center justify-center rounded-lg bg-indigo-500 px-3 py-2"
          onPress={() => setView("overview")}
        >
          <Text className="flex cursor-pointer items-center justify-center text-white">
            Overview
          </Text>
        </Pressable>
      ) : (
        <Pressable
          className=" flex w-6/12  items-center justify-center rounded-lg bg-inherit px-3 py-2"
          onPress={() => setView("overview")}
        >
          <Text className="flex cursor-pointer items-center justify-center text-slate-900">
            Overview
          </Text>
        </Pressable>
      )}
      {view === "tracker" ? (
        <Pressable
          className=" flex w-6/12  items-center justify-center rounded-lg bg-indigo-500 px-3 py-2"
          onPress={() => setView("tracker")}
        >
          <Text className="flex cursor-pointer items-center justify-center text-white">
            Tracker
          </Text>
        </Pressable>
      ) : (
        <Pressable
          className=" flex w-6/12  items-center justify-center rounded-lg bg-inherit px-3 py-2"
          onPress={() => setView("tracker")}
        >
          <Text className="flex cursor-pointer items-center justify-center text-slate-900">
            Tracker
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const PaymentTrackingScreen = ({
  transaction,
}: {
  transaction: Transaction & {
    recipient: Recipient;
    payment: Payment & {
      rate: Rate;
      ExchangeRate: ExchangeRate;
    };
    Status: Status[];
  };
}) => {
  const schema = z.object({
    bankReferenceNumber: z.string(),
  });

  const { mutate: addBankReference, isLoading } =
    api.transaction.addBankRef.useMutation({
      onError(error) {
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
      },
      onSuccess: async () => {
        await ctx.transaction.invalidate();
      },
    });
  const statuses = transaction.Status;
  const data = statuses.map((s) => ({
    time: s.createdAt.toLocaleString(),
    status: s.name,
    title:
      s.name === "To_Confirm"
        ? "Awaiting your confirmation"
        : `Payment ${s.name}`,
    description:
      s.name === "Paused"
        ? "Payment needs your action "
        : s.name === "Sent"
        ? "Payment has been sent to recipient"
        : s.name === "Received"
        ? "Payment has been received by recipient"
        : s.name === "Processing"
        ? "Payment is being processed"
        : s.name === "Declined"
        ? "Transaction cancelled due to invalid reference number"
        : s.name === "To_Confirm"
        ? "Waiting for you to provide bank reference for confirmation"
        : `Payment has been ${s.name}`,
  }));
  const ctx = api.useContext();
  const lastIndexStatus = statuses.length - 1;
  const isCancelled = statuses.at(lastIndexStatus)?.name === "Cancelled";
  const isDeclined = statuses.at(lastIndexStatus)?.name === "Declined";
  const isSent = statuses.at(lastIndexStatus)?.name === "Sent";
  const isProcessed = statuses.at(lastIndexStatus)?.name === "Processed";
  const isReceived = statuses.at(lastIndexStatus)?.name === "Received";
  const cannotCancel =
    isCancelled || isDeclined || isSent || isProcessed || isReceived;
  const { mutate: cancel, isLoading: isCancelLoading } =
    api.transaction.cancel.useMutation({
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
      onSuccess: async () => {
        await ctx.transaction.invalidate();
      },
    });
  type FormData = z.infer<typeof schema>;
  const onSubmit = (data: FormData) => {
    addBankReference({
      id: transaction.id,
      ...data,
    });
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [isShowModal, setIsShowModal] = useState(false);
  return (
    <ScrollView style={styles.container}>
      {data.map((item, index) => (
        <View key={index} style={styles.trackerItem}>
          {index !== data.length - 1 && <View style={styles.line} />}
          <View
            style={[styles.circle, { backgroundColor: getColor(item.status) }]}
          />
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.time}>{item.time}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
      ))}

      <Modal visible={isShowModal} animationType="slide">
        <View className="flex flex-1 items-center justify-center p-5">
          <View className="fixed top-0 flex h-48 w-full  justify-center rounded-md border border-slate-200 bg-slate-50 p-5">
            <Text className="text-lg">
              Are you sure you want to cancel this transaction?
            </Text>
            <View className=" my-5 flex w-full flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => setIsShowModal(false)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-500 px-10  py-2  text-sm transition-all hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <Text className="text-sm text-white">No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  cancel({ id: transaction.id });
                  setIsShowModal(false);
                }}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-500 px-10  py-2  text-sm transition-all hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <Text className="text-sm text-white">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {((!isCancelled && !transaction.bankReferenceNumber) || isDeclined) && (
        <View className="mt-7 h-fit w-full rounded-md border border-slate-300 bg-slate-50 bg-opacity-50 p-3 shadow-xl">
          <Text className="mt-3 text-xl font-semibold text-slate-700">
            Payment confirmation
          </Text>
          <View className="mt-3  flex w-full justify-between">
            <View className=" flex w-full items-start justify-between ">
              <Text className=" mb-2 text-slate-700">
                Enter the bank reference number
              </Text>
              {errors.bankReferenceNumber && (
                <Text className=" mb-2 text-red-500">
                  {errors.bankReferenceNumber.message}
                </Text>
              )}
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    placeholder="Bank reference number"
                    onChangeText={(value) => onChange(value)}
                    className={`block w-full rounded-md border bg-white px-4 py-3 ${
                      errors.bankReferenceNumber
                        ? "border-red-500  focus:border-green-500 focus:ring-green-500"
                        : " border-gray-300  focus:border-green-500 focus:ring-green-500"
                    }`}
                    value={value}
                  />
                )}
                name="bankReferenceNumber"
              />
            </View>
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isCancelLoading || isLoading}
              className={` mt-3 flex w-full flex-row items-center justify-around rounded-lg ${
                isLoading ? "bg-slate-400" : " bg-teal-400"
              } px-4 py-3.5 `}
            >
              <Text className={` "text-lg text-gray-50" font-bold`}>
                {isLoading ? "Confirming payment" : " Confirm payment"}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
      {!cannotCancel && (
        <View className="my-5 flex items-center justify-center">
          <TouchableOpacity
            onPress={() => setIsShowModal(true)}
            disabled={isLoading || isCancelLoading}
            className={` flex  items-center justify-center rounded-xl px-3 py-3 ${
              isLoading || isCancelLoading ? "bg-slate-400" : "bg-red-400"
            }`}
          >
            <Text
              className={`text-sm text-white ${
                isLoading || isCancelLoading ? "text-slate-700" : "text-white"
              }`}
            >
              {isCancelLoading
                ? "Cancelling Transaction"
                : "  Cancel Transaction"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const getColor = (status: string) => {
  return status === "Received" || status === "Processed"
    ? "#4ade80"
    : status === "Cancelled" || status === "Declined"
    ? "#ef4444"
    : status === "Paused" || status === "To_Confirm"
    ? "rgb(234 179 8)"
    : "rgb(14 165 233 )";
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  trackerItem: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-start", // Align items at the top
  },
  line: {
    width: 2,
    backgroundColor: "#3f51b5",
    position: "absolute",
    top: 10,
    bottom: 0,
    left: 9,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
    alignSelf: "flex-start",
    marginTop: 8, // Adjust the margin-top value to align the circle with the title
    zIndex: 1,
  },
  content: {
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: "#3f51b5",
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "gray",
  },
});

const TransactionsDetails = ({
  transaction,
}: {
  transaction: Transaction & {
    recipient: Recipient;
    payment: Payment & {
      rate: Rate;
      ExchangeRate: ExchangeRate;
    };
    Status: Status[];
  };
}) => {
  const statuses = transaction.Status;
  const lastIndexStatus = statuses.length - 1;
  const isCancelled = statuses.at(lastIndexStatus)?.name === "Cancelled";
  const isDeclined = statuses.at(lastIndexStatus)?.name === "Declined";
  const isNewBankReferenceNeeded = isCancelled || isDeclined;

  return (
    <View className="my-5 h-full  w-full">
      <View className="mt-7 h-fit w-full rounded-md border border-slate-300 bg-slate-50 bg-opacity-50 p-3 shadow-xl">
        <Text className="mt-3 text-xl font-semibold text-slate-700">
          Transactions details
        </Text>
        <View className="mt-3 flex w-full flex-row justify-between">
          <Text className="text-base">Amount Remitted</Text>
          <Text className="text-base">
            {transaction.payment.ExchangeRate.source}{" "}
            {transaction.payment.remittedAmount.toLocaleString()}
          </Text>
        </View>
        <View className="mt-3 flex w-full flex-row justify-between">
          <Text className="text-base">Exchange Rate</Text>
          <Text className="text-base">{transaction.payment.rate.value}</Text>
        </View>
        <View className="mt-3 flex w-full flex-row justify-between">
          <Text className="text-base">Recipient receives</Text>
          <Text className="text-base">
            {transaction.payment.ExchangeRate.target}{" "}
            {transaction.payment.sentAmount.toLocaleString()}
          </Text>
        </View>
      </View>
      {transaction.bankReferenceNumber && !isNewBankReferenceNeeded && (
        <View className="mt-7 h-fit w-full rounded-md border border-slate-300 bg-slate-50 bg-opacity-50 p-3 shadow-xl">
          <Text className="mt-3 text-xl font-semibold text-slate-700">
            Payment Confirmation
          </Text>
          <View className="mt-3 flex w-full flex-row justify-between">
            <Text className="text-base">Bank reference number</Text>
            <Text className="text-base">{transaction.bankReferenceNumber}</Text>
          </View>
        </View>
      )}
      <View className="mt-7 h-fit w-full rounded-md border border-slate-300 bg-slate-50 bg-opacity-50 p-3 shadow-xl">
        <Text className="mt-3 text-xl font-semibold text-slate-700">
          Recipient&apos;s details
        </Text>
        <View className="mt-3 flex w-full flex-row justify-between">
          <Text className="text-base">Recipient Name</Text>
          <Text className="text-base">{transaction.recipient.name}</Text>
        </View>
        <View className="mt-3 flex w-full flex-row justify-between">
          <Text className="text-base">Bank</Text>
          <Text className="text-base">{transaction.recipient.bankName}</Text>
        </View>
        <View className="mt-3 flex w-full flex-row justify-between">
          <Text className="text-base">Bank Account</Text>
          <Text className="text-base">{transaction.recipient.bankAccount}</Text>
        </View>
      </View>
    </View>
  );
};
const PaymentDetails = ({ id }: { id: string }) => {
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

  const [view, setView] = useState<ViewState>("tracker");

  return (
    <ScrollView className="flex-1 ">
      {isLoading && !isError && (
        <View className="flex h-full w-full items-center justify-center bg-teal-500">
          <LoadingComponent />
        </View>
      )}
      <SafeAreaView className="h-fit min-h-screen  w-full bg-white pb-3">
        <Stack.Screen
          options={{ headerStyle: { backgroundColor: "rgb(20 184 166)" } }}
        />
        <StatusBar />

        {!isLoading && transaction && (
          <View className="h-full w-full p-5">
            <Tab view={view} setView={setView} />
            {view === "tracker" && (
              <PaymentTrackingScreen transaction={transaction} />
            )}
            {view === "overview" && (
              <TransactionsDetails transaction={transaction} />
            )}
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

const PaymentId = () => {
  const params = useSearchParams();
  const id = params.transactionId;
  return (
    <View className="flex-1">
      {id && typeof id === "string" && <PaymentDetails id={id} />}
      {!id || (typeof id !== "string" && <NoContent content="transaction" />)}
    </View>
  );
};

export default PaymentId;
