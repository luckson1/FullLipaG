import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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
import {
  type ExchangeRate,
  type Payment,
  type Rate,
  type Recipient,
  type Status,
  type Transaction,
} from ".prisma/client";

type ViewState = "timeline" | "overview";
const Tab = ({
  view,
  setView,
}: {
  view: ViewState;
  setView: React.Dispatch<React.SetStateAction<ViewState>>;
}) => {
  return (
    <View className="mx-auto flex h-fit w-full max-w-xl flex-row items-center justify-between rounded-lg bg-slate-100 p-0.5 text-xs">
      {view === "overview" ? (
        <Pressable
          className=" flex w-6/12  items-center justify-center rounded-lg bg-slate-900 px-3 py-2"
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
      {view === "timeline" ? (
        <Pressable
          className=" flex w-6/12  items-center justify-center rounded-lg bg-slate-900 px-3 py-2"
          onPress={() => setView("timeline")}
        >
          <Text className="flex cursor-pointer items-center justify-center text-white">
            Timeline
          </Text>
        </Pressable>
      ) : (
        <Pressable
          className=" flex w-6/12  items-center justify-center rounded-lg bg-inherit px-3 py-2"
          onPress={() => setView("timeline")}
        >
          <Text className="flex cursor-pointer items-center justify-center text-slate-900">
            Timeline
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const PaymentTrackingScreen = ({ statuses }: { statuses: Status[] }) => {
  const data = statuses.map((s) => ({
    time: s.createdAt.toLocaleString(),
    title: `Payment ${s.name}`,
    description:
      s.name === "Paused"
        ? "Payment needs your action "
        : s.name === "Sent"
        ? "Payment has been sent to recipient"
        : s.name === "Received"
        ? "Payment has been received by recipient"
        : s.name === "To_Confirm"
        ? "Waiting for you to provide bank reference for confirmation"
        : `Payment has been ${s.name}`,
  }));
  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={index} style={styles.timelineItem}>
          {index !== data.length - 1 && <View style={styles.line} />}
          <View style={[styles.circle, { backgroundColor: getColor(index) }]} />
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.time}>{item.time}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const getColor = (index: number) => {
  const colors = ["#3f51b5", "#ff4081", "#4caf50", "#fbc02d", "#9c27b0"]; // Array of different colors for circles
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  timelineItem: {
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
  };
}) => {
  const schema = z.object({
    bankReferenceNumber: z.string(),
  });
  const ctx = api.useContext();
  const { mutate: addBankReference, isLoading } =
    api.transaction.edit.useMutation({
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
        await ctx.transaction.getUsersOne.invalidate();
      },
    });

  type FormData = z.infer<typeof schema>;
  const onSubmit = (data: FormData) => {
    addBankReference({
      paymentId: transaction.paymentId,
      paymentMethod: transaction.paymentMethod,
      id: transaction.id,
      ...data,
      status: "Processing",
    });
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  return (
    <View className="my-5 h-full  w-full">
      <View className="mt-7 h-fit w-full rounded-md border border-slate-300 bg-slate-50 bg-opacity-50 p-3 shadow-xl">
        <Text className="mt-3 text-xl font-semibold text-slate-700">
          Transactions details
        </Text>
        <View className="mt-3 flex w-full flex-row justify-between">
          <Text className="text-base">Amount Remitted</Text>
          <Text className="text-base">
            {transaction.payment.remittedAmount}
          </Text>
        </View>
        <View className="mt-3 flex w-full flex-row justify-between">
          <Text className="text-base">Exchange Rate</Text>
          <Text className="text-base">{transaction.payment.rate.value}</Text>
        </View>
        <View className="mt-3 flex w-full flex-row justify-between">
          <Text className="text-base">Recipient receives</Text>
          <Text className="text-base">{transaction.payment.sentAmount}</Text>
        </View>
      </View>
      {transaction.bankReferenceNumber && (
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
          <Text className="text-base"></Text>
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
      {!transaction.bankReferenceNumber && (
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
              disabled={isLoading}
              className={` mt-3 flex w-full flex-row items-center justify-around rounded-lg ${
                isLoading ? "bg-slate-400" : " bg-green-400"
              } px-4 py-3.5 `}
            >
              <Text className={` "text-lg text-gray-50" font-bold`}>
                Confirm payment
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};
const PaymentId = () => {
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

  const [view, setView] = useState<ViewState>("overview");

  return (
    <ScrollView className="flex-1 ">
      <SafeAreaView className="h-fit min-h-screen  w-full bg-white pb-3">
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar />
        {isLoading && !isError && (
          <View className="flex h-full w-full items-center justify-center bg-teal-500">
            <LoadingComponent />
          </View>
        )}
        {!isLoading && transaction && (
          <View className="h-full w-full p-5">
            <Tab view={view} setView={setView} />
            {view === "timeline" && (
              <PaymentTrackingScreen statuses={transaction.Status} />
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

export default PaymentId;
