import { SafeAreaView, ScrollView, Text, TouchableOpacity } from "react-native";
import Toast from "react-native-root-toast";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { View } from "native-base";

import { api } from "~/utils/api";
import LoadingComponent from "~/components/LoadingComponent";

const RecipientID = () => {
  const params = useSearchParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: recipient, isLoading } = api.recipient.getUsersOne.useQuery(
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
    },
  );
  return (
    <ScrollView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          presentation: "modal",
          headerTitle: `${recipient?.name ?? "recipient"}'s details`,
        }}
      />
      <SafeAreaView className="flex w-full flex-col items-center justify-between  p-5">
        {isLoading && <LoadingComponent />}
        {recipient && (
          <View className=" my-5 w-full rounded-xl border border-green-300 bg-green-50 bg-opacity-5 py-3 shadow-xl">
            <View className="flex w-full flex-row justify-between px-5 py-3">
              <Text className="text-start">Bank</Text>
              <Text className="text-end"> {recipient?.bankName}</Text>
            </View>
            <View className="flex w-full flex-row justify-between px-5 py-3">
              <Text className="text-start">Country</Text>
              <Text className="text-end"> {recipient?.bankCountry}</Text>
            </View>
            <View className="flex w-full flex-row justify-between px-5 py-3">
              <Text className="text-start">Swift Code</Text>
              <Text className="text-end"> {recipient?.swiftCode}</Text>
            </View>
            <View className="flex w-full flex-row justify-between px-5 py-3">
              <Text className="text-start">Bank Account</Text>
              <Text className="text-end"> {recipient?.bankAccount}</Text>
            </View>
            <View className="flex w-full items-center justify-center">
              <TouchableOpacity
                className="flex w-20 flex-row items-center justify-around  rounded-md bg-yellow-500 py-2"
                onPress={() => {
                  router.push(`/recipients/edit?id=${recipient.id}`);
                }}
              >
                <Text className=" text-sm text-white">Edit</Text>
                <AntDesign name="edit" size={20} color={"white"} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default RecipientID;
