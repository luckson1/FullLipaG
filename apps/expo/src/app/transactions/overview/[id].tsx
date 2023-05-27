import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollView } from 'native-base';

type ViewState= "timeline" | "overview"
const Tab = ({
  view,
  setView,
}: {
  view: ViewState;
  setView: React.Dispatch<React.SetStateAction<ViewState>>;
}) => {
 
  return (
    <View
      className="mx-auto flex h-fit w-full max-w-xl flex-row items-center justify-between rounded-lg bg-slate-100 p-0.5 text-xs"
   
    >
            {view === "overview" ? (
        <Pressable
        className=" w-6/12 py-2  px-3 bg-slate-900 rounded-lg flex justify-center items-center"
         onPress={() => setView('overview')}
        >
          <Text
          className="flex cursor-pointer items-center justify-center text-white"
       
        >   Overview</Text>
        </Pressable>
      ) : (
        <Pressable
        className=" w-6/12 py-2  px-3 bg-inherit rounded-lg flex justify-center items-center"
         onPress={() => setView('overview')}
        >
          <Text
          className="flex cursor-pointer items-center justify-center text-slate-900"
       
        >
        Overview
        </Text>
        </Pressable>
      )}
      {view === "timeline" ? (
        <Pressable
        className=" w-6/12 py-2  px-3 bg-slate-900 rounded-lg flex justify-center items-center"
         onPress={() => setView('timeline')}
        >
          <Text
          className="flex cursor-pointer items-center justify-center text-white"
       
        >
         Timeline
        </Text>
        </Pressable>
      ) : (
        <Pressable
        className=" w-6/12 py-2  px-3 bg-inherit rounded-lg flex justify-center items-center"
         onPress={() => setView('timeline')}
        >
          <Text
          className="flex cursor-pointer items-center justify-center text-slate-900"
       
        >
         Timeline
        </Text>
        </Pressable>
      )}



      
    </View>
  );
};



const PaymentTrackingScreen = () => {
  const data = [
    { time: '2023-05-17 09:00', title: 'Payment Initiated', description: 'Payment has been initiated.' },
    // { time: '2023-05-17 10:30', title: 'Payment Processed', description: 'Payment is being processed.' },
    // { time: '2023-05-17 11:15', title: 'Payment Successful', description: 'Payment has been successfully processed.' },
    // { time: '2023-05-18 14:20', title: 'Payment Sent', description: 'Payment has been sent to the recipient.' },
    // { time: '2023-05-19 10:00', title: 'Payment Received', description: 'Recipient has received the payment.' },
  ];

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

const getColor = (index:number) => {
  const colors = ['#3f51b5', '#ff4081', '#4caf50', '#fbc02d', '#9c27b0']; // Array of different colors for circles
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start', // Align items at the top
  },
  line: {
    width: 2,
    backgroundColor: '#3f51b5',
    position: 'absolute',
    top: 10,
    bottom: 0,
    left: 9,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
    alignSelf: 'flex-start',
    marginTop: 8, // Adjust the margin-top value to align the circle with the title
    zIndex: 1,
  },
  content: {
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: '#3f51b5',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: 'gray',
  },
});

const TransactionsDetails=()=> {
const isConfirmed=false
const schema = z.object({
  referenceNumber:z.string()
 
});

type FormData = z.infer<typeof schema>;
const {
  control,
  handleSubmit,
  formState: { errors },
} = useForm<FormData>({
  resolver: zodResolver(schema),
  
});
  return (
<View className='w-full h-full  my-5'>
 <View className='w-full h-fit mt-7 bg-slate-50 bg-opacity-50 rounded-md shadow-xl border border-slate-300 p-3'>
 <Text className='text-xl font-semibold text-slate-700 mt-3'>Transactions details</Text>
  <View className='flex flex-row w-full mt-3 justify-between'>
    <Text className='text-base'>Amount to send to us</Text>
    <Text className='text-base'>KES. 10,000</Text>
  </View>
  <View className='flex flex-row w-full mt-3 justify-between'>
    <Text className='text-base'>Exchange Rate</Text>
    <Text className='text-base'>135.70</Text>
  </View>
  <View className='flex flex-row w-full mt-3 justify-between'>
    <Text className='text-base'>Recipient receives</Text>
    <Text className='text-base'>1,357,000</Text>
  </View>
 </View>
{ isConfirmed && <View className='w-full h-fit mt-7 bg-slate-50 bg-opacity-50 rounded-md shadow-xl border border-slate-300 p-3'>
<Text className='text-xl font-semibold text-slate-700 mt-3'>Payment Confirmation</Text>
  <View className='flex flex-row w-full mt-3 justify-between'>
    <Text className='text-base'>Bank reference number</Text>
    <Text className='text-base'>RQ67MT6I</Text>
  </View>
  </View>}
  <View className='w-full h-fit mt-7 bg-slate-50 bg-opacity-50 rounded-md shadow-xl border border-slate-300 p-3'>
  <Text className='text-xl font-semibold text-slate-700 mt-3'>Recipient&apos;s details</Text>
  <View className='flex flex-row w-full mt-3 justify-between'>
    <Text className='text-base'>Name</Text>
    <Text className='text-base'>Ho Lee Sheet</Text>
  </View>
  <View className='flex flex-row w-full mt-3 justify-between'>
    <Text className='text-base'>Bank</Text>
    <Text className='text-base'>China Bank</Text>
  </View>
  <View className='flex flex-row w-full mt-3 justify-between'>
    <Text className='text-base'>Bank Account</Text>
    <Text className='text-base'>80948573850</Text>
  </View>
  </View>
  { !isConfirmed && <View className='w-full h-fit mt-7 bg-slate-50 bg-opacity-50 rounded-md shadow-xl border border-slate-300 p-3'>
<Text className='text-xl font-semibold text-slate-700 mt-3'>Payment confirmation</Text>
  <View className='flex  w-full mt-3 justify-between'>
  <View className=" flex w-full items-start justify-between ">
          <Text className=" mb-2 text-slate-700">Enter the bank reference number</Text>
          {errors.referenceNumber && (
            <Text className=" mb-2 text-red-500">
              {" "}
              {errors.referenceNumber.message}
            </Text>
          )}
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                placeholder='Bank reference number'
                onChangeText={(value) => onChange(value)}
                className= {`block w-full rounded-md border bg-white px-4 py-3 ${errors.referenceNumber? "border-red-500  focus:border-green-500 focus:ring-green-500": " border-gray-300  focus:border-green-500 focus:ring-green-500"}`}
                value={value}
              />
            )}
            name="referenceNumber"
          />
        </View>
        <Pressable
    
        onPress={()=> console.log("hi")}
        className={` rounded-lg flex-row px-4 py-3.5 w-full flex justify-around items-center mt-3 bg-green-400 `}>
     
        <Text className= {` "text-lg font-bold text-gray-50"`}>Confirm payment</Text>
      </Pressable>
  </View>
  </View>}
</View>
  )
}
const PaymentId = () => {
  const [view, setView]=useState<ViewState>('overview')
  return (
    <ScrollView className='flex-1 '>
    <SafeAreaView className='w-full h-fit  bg-white pb-3 min-h-screen'>
      <Stack.Screen options={{headerShown:false}}/>
      <StatusBar />
      <View className='w-full h-full p-5'>
        <Tab view={view} setView={setView}/>
     { view==='timeline'  &&<PaymentTrackingScreen />}
     {view==="overview" && <TransactionsDetails />}

      </View>
    
    </SafeAreaView >
    </ScrollView>
  )
}

export default PaymentId