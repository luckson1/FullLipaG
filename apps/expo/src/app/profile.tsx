import {  Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardAvoidingView } from 'react-native';
import { Stack } from 'expo-router';
import { DatePickerInput } from 'react-native-paper-dates';
const profileSchema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, {message: 'Last name is required' }),
    email: z.string().email().nonempty({message:"Email required"}),
    governmentId: z
      .string()
      .min(1, {message: 'Government ID is required' }),
    dateOfBirth: z.date(),
  });
  type Profile=z.infer<typeof profileSchema>
  const ProfileCreationScreen = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<Profile>({
      resolver: zodResolver(profileSchema),
    });
  
    const onSubmit = (data: Profile) => {
      // Handle form submission
      console.log(data);
    };
    return (
<View className="flex-1 bg-teal-500 flex w-full items-center justify-between ">
       <Stack.Screen options={{title:"Profile", headerTitleStyle: {color: "rgb(226 232 240)"}, headerStyle: {backgroundColor:"rgb(20 184 166) "}}}/>
        <View className='flex-[15%] flex justify-start items-start w-full'>
          <Text className='text-slate-200 text-xl mx-5 my-2 text-start font-semibold'>Tell us about yourself</Text>


        </View>
        <View className='w-full flex-[75%] p-2 justify-center items-center bg-white'>
        <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  keyboardVerticalOffset={Platform.OS==="ios"? 0: 0} className=' flex w-full bg-white bg-red-5 p-5 rounded-3xl absolute -top-12 shadow'>
          
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <TextInput
               onChangeText={field.onChange}
                onBlur={field.onBlur}
          className='border rounded-md  border-slate-300 focus:border-teal-500 text-lg py-3 px-4 w-full my-2'
                placeholder="First Name"
                autoCapitalize="none"
              />
            )}
          />
          {errors.firstName && <Text className='text-red-400 mt-2'>{errors.firstName.message}</Text>}
    
          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <TextInput
               onChangeText={field.onChange}
                onBlur={field.onBlur}
          className='border rounded-md  border-slate-300 focus:border-teal-500 text-lg py-3 px-4 w-full my-2'
                placeholder="Last Name"
                autoCapitalize="none"
              />
            )}
          />
             <Controller
            control={control}
            name="dateOfBirth"
            render={({ field }) => (
              <DatePickerInput
              className='border rounded-md  border-slate-300 focus:border-teal-500 text-lg  bg-white px-4 w-full my-2'
          locale="en-GB"
          label="Date of Birth"
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          inputMode="start"
        />
            )}
          />
       
          {errors.dateOfBirth && <Text className='text-red-400 mt-2'>{errors.dateOfBirth.message}</Text>}
          {errors.lastName && <Text className='text-red-400 mt-2'>{errors.lastName.message}</Text>}
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextInput
               onChangeText={field.onChange}
                onBlur={field.onBlur}
          className='border rounded-md  border-slate-300 focus:border-teal-500 text-lg py-3 px-4 w-full my-2'
                placeholder="Email"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && <Text className='text-red-400 mt-2'>{errors.email.message}</Text>}
    
          <Controller
            control={control}
            name="governmentId"
            render={({ field }) => (
              <TextInput
              keyboardType='numeric'
               onChangeText={field.onChange}
                onBlur={field.onBlur}
                className='border rounded-md  border-slate-300 focus:border-teal-500 text-lg py-3 px-4 w-full my-2'
                placeholder="Government ID"
                autoCapitalize="none"
              />
            )}
          />
          {errors.governmentId && <Text className='text-red-400 mt-2'>{errors.governmentId.message}</Text>}
    
   
    
        
        </KeyboardAvoidingView>
        </View>
        <View className="w-full bg-white px-7 py-2 flex-[10%] flex justify-end items-center ">
          <TouchableOpacity
            className="my-2 flex w-full   items-center justify-center rounded-lg bg-green-400 px-4 py-3 shadow-xl absolute bottom-2"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-xl font-bold text-white">Create Profile</Text>
          </TouchableOpacity>
        </View>
        </View>
      );
  };

 
   
  
  export default ProfileCreationScreen;