
import React, { useState } from 'react'
import { Modal , Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import { Icon } from '@rneui/themed'

import { Divider } from '@rneui/base'
import { Stack, useRouter } from 'expo-router'



type ModalType= "paymentMethod" | "bankPolicy" | "transferInfo"
const BankPolicy=({setIsShowModal}: {setIsShowModal: React.Dispatch<React.SetStateAction<ModalType>>})=> {
    return (
        <SafeAreaView className="flex flex-1 flex-col items-start justify-start  p-5">
   
   <View className="mt-5 my-10 flex w-full  flex-row items-center justify-between px-3">
          
          <TouchableOpacity
            className="rounded-full p-2"
            onPress={() => setIsShowModal('paymentMethod')}
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
    
          <View className="flex flex-row w-full my-5 gap-x-3 justify-center items-center">
          <Icon
              name="description"
              type="material"
              size={40}
              color={"grey"}
            />
            <Text className="w-[80%] text-lg text-slate-700">We will give you our bank details</Text>

          </View>
          <View className="flex flex-row w-full my-5 gap-x-3 justify-center items-center">
          <Icon
                  name="account-balance"
                  type="material"
                  size={40}
                  color={"white"}
                  backgroundColor={"#9700b9"}
                  borderRadius={10}
                />
                <Text className="w-[80%] text-lg text-slate-700">Make a Wire Transfer from your account to our bank account</Text>
          </View>
          <View className="flex flex-row w-full my-5 gap-x-3 justify-center items-center">
          <Icon
                      name="check"
                      type="material"
                      size={40}
                      color={"white"}
                      backgroundColor={"#4ade80"}
                      borderRadius={10}
                 
                />
                <Text className="w-[80%] text-lg text-slate-700">Get the bank reference number after sending us the funds, to confirm the payment</Text>
          </View>
          <View className="flex flex-row w-full my-5 gap-x-3 justify-center items-center ">
          <Icon
                      name="arrow-upward"
                      type="material"
                      size={40}
                      color={"white"}
                      backgroundColor={"#4ade80"}
                      borderRadius={10}
                 
                />
                <Text className="w-[80%] text-lg text-slate-700">Once we confirm the receipt of the funds, we will send it to the recipient</Text>
          </View>
          
  
                  
          <TouchableOpacity
            className="rounded-lg w-full py-3 bg-green-400 flex justify-center items-center "
            onPress={() => setIsShowModal('transferInfo')}
          >
           <Text className="text-white text-lg"> Understood</Text>
          </TouchableOpacity>
       
        </SafeAreaView>
    )
}
const TransferInfo=({setIsShowModal}: {setIsShowModal: React.Dispatch<React.SetStateAction<ModalType>>})=> {
  const router=useRouter()  
  return (
        < ScrollView className="flex-1">
            <SafeAreaView className="flex flex-1 flex-col items-start justify-center  p-8">
   
            <View className="mt-5  flex w-full  flex-row items-center justify-between ">
          
          <TouchableOpacity
            className="rounded-full p-2"
            onPress={()=> { setIsShowModal('bankPolicy')}}
          >
            <Icon
              name="arrow-left"
              type="font-awesome"
              size={30}
              color={"gray"}
            />
          </TouchableOpacity>
          <Text className="text-xl">Pay by making bank transfer?</Text>
        </View>
    
         <View className="flex w-full items-center justify-center py-3 border-b-2 border-slate-400">
       
          <View className="w-full bg-slate-100 rounded-xl shadow h-48 p-5 justify-between items-start my-4">
           <View className="w-full flex justify-center items-center">
           <Icon name="info" size={48} type="material" color={"#0ea5e9"}/>
           </View>
            
<Text>1. Make a wire transfer to the accounts below:</Text>
<Text>2. Get the Bank Reference Number</Text>
          </View> 
          <Text>
            Bank Transfer Instructions
          </Text>
         </View>
<View className="flex my-4">
    <Text className="text-thin">Payee Name</Text>
    <Text className="text-xl">Lipa Global Ltd</Text>

</View>
<View className="flex my-4">
     <Text className="text-thin">Bank Name</Text>
    <Text className="text-xl">Equity Bank Kenya</Text>

</View>
<View className="flex my-4">
     <Text className="text-thin">Account Number</Text>
    <Text className="text-xl">0160196743780</Text>

</View>
<View className="flex my-4">
     <Text className="text-thin">Bank Branch</Text>
    <Text className="text-xl">Canva Corporate Branch</Text>

</View>
<View className="flex my-4">
     <Text className="text-thin">Bank Branch</Text>
    <Text className="text-xl">Canva Corporate Branch</Text>

</View>
   
                  
          <View className="flex gap-y-4 w-full my-4">
          <TouchableOpacity
            className="rounded-lg w-full py-3 bg-green-400 flex justify-center items-center "
            onPress={() =>router.push("/transactions/overview/id")}
          >
           <Text className="text-white text-lg"> I have made the transfer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-lg w-full py-3 bg-inherit flex justify-center items-center border border-green-400"
            onPress={() => router.push("/transfers/overview/id")}
          >
           <Text className=" text-lg"> I will make the transfer later</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-lg w-full py-3 bg-inherit flex justify-center items-center border border-green-400"
            onPress={() => router.push("/transactionsoverview/id")}
          >
           <Text className=" text-lg"> I need help</Text>
          </TouchableOpacity>
          </View>
          </SafeAreaView>
        </ScrollView>
    )
}

const PaymentMethod = ({setIsShowModal}: {setIsShowModal: React.Dispatch<React.SetStateAction<ModalType>>})=> {
  const router=useRouter()
  return (
    <ScrollView className="flex-1">
      <SafeAreaView className="flex w-full flex-col items-center justify-between  p-5">
        <View className="my-5 flex w-full  flex-row items-center justify-between px-3">
          
          <TouchableOpacity
            className="rounded-full p-2"
            onPress={() => router.back()}
          >
            <Icon
              name="arrow-left"
              type="font-awesome"
              size={30}
              color={"gray"}
            />
          </TouchableOpacity>
          <Text className="text-xl">How do you want to pay?</Text>
        </View>

        <TouchableOpacity className=" mt-5 flex w-full items-center justify-center   py-5 shadow-lg shadow-green-400/100">
          <View className=" w-full gap-y-3">
          <Divider />
            <Text className="  text-xl">Mpesa</Text>
           
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
        <TouchableOpacity className=" mt-5 flex w-full items-center justify-center   py-5 shadow-lg shadow-green-400/100">
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
                  {" "}
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
        <TouchableOpacity className=" mt-5 flex w-full items-center justify-center   py-5 shadow-lg shadow-green-400/100" onPress={()=> { setIsShowModal('bankPolicy')}}>
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
  <Stack.Screen  options={{headerShown: false}} />

    const [isShowModal, setIsShowModal] = useState<ModalType>('paymentMethod');

  return (
<SafeAreaView className='flex-1 bg-white'>
<Modal
        visible={isShowModal==="paymentMethod"}
        animationType="slide"
        
      >
        <PaymentMethod setIsShowModal={setIsShowModal} />
      </Modal>
      <Modal
       visible={isShowModal==="bankPolicy"}
       animationType="slide"
     
      >
        <BankPolicy setIsShowModal={setIsShowModal} />
      </Modal>
      
      <Modal
      visible={isShowModal==="transferInfo"}
      animationType="slide"
      
      >
        <TransferInfo setIsShowModal={setIsShowModal}/>
      </Modal>

</SafeAreaView>
  )
}

export default TransactionId