import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import Toast from "react-native-root-toast";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { View } from "native-base";

import { api } from "~/utils/api";
import LoadingComponent from "~/components/LoadingComponent";
import NoContent from "~/components/NoContent";

const RecipientCard = ({ id }: { id: string }) => {
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
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          presentation: "modal",
          headerStyle: { backgroundColor: "rgb(20 184 166)" },
          headerTitleStyle: { color: "#fff" },
          headerTitle: `${recipient?.name ?? "Recipient"}'s details`,
        }}
      />
      <SafeAreaView className="flex h-full w-full flex-col items-center justify-between  p-5">
        {isLoading && (
          <View className="h-full w-full">
            <LoadingComponent />
          </View>
        )}
        {recipient && (
          <View className=" my-5 w-full rounded-xl border border-slate-300 bg-slate-50 bg-opacity-5 py-3 shadow-xl">
            <View className="flex w-full flex-row justify-between px-5 py-3">
              <Text className="text-start">Bank</Text>
              <Text className="text-end"> {recipient.bankName}</Text>
            </View>
            <View className="flex w-full flex-row justify-between px-5 py-3">
              <Text className="text-start">Country</Text>
              <Text className="text-end"> {recipient.bankCountry}</Text>
            </View>
            <View className="flex w-full flex-row justify-between px-5 py-3">
              <Text className="text-start">Swift Code</Text>
              <Text className="text-end"> {recipient.swiftCode}</Text>
            </View>
            <View className="flex w-full flex-row justify-between px-5 py-3">
              <Text className="text-start">Bank Account</Text>
              <Text className="text-end"> {recipient.bankAccount}</Text>
            </View>
            <View className="flex w-full items-start justify-center px-5">
              <TouchableOpacity
                className="my-3 flex flex-row items-center"
                onPress={() => {
                  router.push(`/recipients/edit?recipientId=${recipient.id}`);
                }}
              >
                <Text className=" mr-3  text-sky-500">Edit</Text>
                <AntDesign name="edit" size={20} color={"rgb(14 165 233)"} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const RecipientId = () => {
  const params = useSearchParams();

  const id = params.recipientId;

  return (
    <View className="flex-1">
      {id && typeof id === "string" && <RecipientCard id={id} />}
      {!id ||
        (typeof id !== "string" && (
          <View className="flex items-center justify-center">
            <NoContent content="recipient" />
          </View>
        ))}
    </View>
  );
};

export default RecipientId;
