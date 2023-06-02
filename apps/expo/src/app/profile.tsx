import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { DatePickerInput } from "react-native-paper-dates";
import Toast from "react-native-root-toast";
import { Stack, useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, Select } from "native-base";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "~/utils/api";
import LoadingComponent from "~/components/LoadingComponent";

const profileSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email().nonempty({ message: "Email required" }),
  governmentId: z.string().min(1, { message: "Government ID is required" }),
  gender: z.enum(["Male", "Female"]),
  dateOfBirth: z.date(),
});
type Profile = z.infer<typeof profileSchema>;

const ProfileCreationScreen = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Profile>({
    resolver: zodResolver(profileSchema),
  });

  const { mutate: createProfile, isLoading: isProfileCreationLoading } =
    api.profile.create.useMutation({
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
    });

  const onSubmit = (data: Profile) => {
    // Handle form submission
    createProfile(data);
    router.push("/home");
  };
  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          title: "Profile",
          headerTitleStyle: { color: "rgb(226 232 240)" },
          headerStyle: { backgroundColor: "rgb(20 184 166) " },
        }}
      />

      <View className="flex w-full flex-1 items-center justify-between bg-teal-500 ">
        <View className="flex w-full flex-[15%] items-start justify-start">
          <Text className="mx-5 my-2 text-start text-xl font-semibold text-slate-200">
            Tell us about yourself
          </Text>
        </View>
        <View className="w-full flex-[75%] items-center justify-center bg-white p-2">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            className=" bg-red-5 absolute -top-12 flex w-full rounded-3xl bg-white p-5 shadow"
          >
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <TextInput
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  className="my-2 w-full  rounded-md border border-slate-300 px-4 py-3 text-lg focus:border-teal-500"
                  placeholder="First Name"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.firstName && (
              <Text className="mt-2 text-red-400">
                {errors.firstName.message}
              </Text>
            )}

            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <TextInput
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  className="my-2 w-full  rounded-md border border-slate-300 px-4 py-3 text-lg focus:border-teal-500"
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
                  className="my-2 w-full  rounded-md border border-slate-300  bg-white px-4 text-lg focus:border-teal-500"
                  locale="en-GB"
                  label="Date of Birth"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputMode="start"
                />
              )}
            />

            {errors.dateOfBirth && (
              <Text className="mt-2 text-red-400">
                {errors.dateOfBirth.message}
              </Text>
            )}
            {errors.lastName && (
              <Text className="mt-2 text-red-400">
                {errors.lastName.message}
              </Text>
            )}
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <TextInput
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  className="my-2 w-full  rounded-md border border-slate-300 px-4 py-3 text-lg focus:border-teal-500"
                  placeholder="Email"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.email && (
              <Text className="mt-2 text-red-400">{errors.email.message}</Text>
            )}

            <Controller
              control={control}
              name="governmentId"
              render={({ field }) => (
                <TextInput
                  keyboardType="numeric"
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  className="my-2 w-full  rounded-md border border-slate-300 px-4 py-3 text-lg focus:border-teal-500"
                  placeholder="Government ID"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.governmentId && (
              <Text className="mt-2 text-red-400">
                {errors.governmentId.message}
              </Text>
            )}
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <Select
                  selectedValue={value}
                  width="100%"
                  className="block w-full  rounded-lg  border-gray-300 px-4 py-3.5 text-base"
                  accessibilityLabel="Choose Gender"
                  placeholder="Choose Gender"
                  _selectedItem={{
                    bg: "green.400",

                    endIcon: <CheckIcon size="25" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) => {
                    onChange(itemValue);
                  }}
                >
                  <Select.Item label=" Male" value={"Male"} />
                  <Select.Item label=" Female" value={"Female"} />
                </Select>
              )}
            />
          </KeyboardAvoidingView>
        </View>
        <View className="flex w-full flex-[10%] items-center justify-end bg-white px-7 py-2 ">
          <TouchableOpacity
            className="absolute bottom-2 my-2   flex w-full items-center justify-center rounded-lg bg-green-400 px-4 py-3 shadow-xl"
            onPress={handleSubmit(onSubmit)}
          >
            <Text
              className="text-xl font-bold text-white"
              disabled={isProfileCreationLoading}
            >
              {isProfileCreationLoading ? "Loading" : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileCreationScreen;
