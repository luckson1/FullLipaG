import { useRouter } from "expo-router";
import { View } from "native-base";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";


const Confirmation = () => {
    const router=useRouter()
    return (
      <ScrollView className="flex-1 bg-white">
        <SafeAreaView className="flex w-full flex-col items-center justify-between  p-5">
          <View className=" my-5 w-full rounded-xl bg-slate-100 border border-slate-300 py-3 shadow-xl">
            <Text className=" mx-5 font-bold text-xl">
              Hoo Lee Sheet Inc&apos;s Details
            </Text>
            <View className="flex w-full flex-row justify-between px-5 py-3">
              <Text className="text-start">Bank</Text>
              <Text className="text-end">China Bank</Text>
            </View>
            <View className="flex w-full flex-row justify-between px-5 py-3">
              <Text className="text-start">Country</Text>
              <Text className="text-end">China</Text>
            </View>
            <View className="flex w-full flex-row justify-between px-5 py-3">
              <Text className="text-start">Swift Code</Text>
              <Text className="text-end">123PS</Text>
            </View>
            <View className="flex w-full flex-row justify-between px-5 py-3">
              <Text className="text-start">Bank Account</Text>
              <Text className="text-end">1234567891011123</Text>
            </View>
          </View>
          <View className=" my-5 w-full rounded-xl bg-slate-100 border border-slate-300 py-3 shadow-xl">
            <Text className=" mx-5 font-bold text-xl">Transfer Details Details</Text>
            <View className="flex w-full flex-row justify-between px-5 py-3">
              <Text className="text-start">The Recipient Gets:</Text>
              <Text className="text-end"> USD 10,000</Text>
            </View>
            <View className="flex w-full flex-row justify-between px-5 py-3">
              <Text className="text-start">You Send:</Text>
              <Text className="text-end">USD 1,357,000</Text>
            </View>
            <View className="flex w-full flex-row justify-between px-5 py-3">
              <Text className="text-start">Exchange Rate:</Text>
              <Text className="text-end"> 1 USD = 135.7 KES</Text>
            </View>
          </View>
          <View className="my-5 w-full">
            <TouchableOpacity className="my-2 flex w-full   items-center justify-center rounded-lg bg-green-400 px-4 py-3 shadow-xl" onPress={()=> router.push('/transactions/id')}>
              <Text className="text-xl font-bold text-white">Confirm</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  };

  export default Confirmation