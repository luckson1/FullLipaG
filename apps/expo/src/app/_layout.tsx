import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { NativeBaseProvider } from "native-base";

import { TRPCProvider } from "../utils/api";
import { supabase } from "../utils/supabase";

export default function RootLayout() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <TRPCProvider>
        <RootSiblingParent>
          <NativeBaseProvider>
            <SafeAreaProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                <Stack.Screen
                  name="(public)"
                  options={{ headerShown: false }}
                />

                <Stack.Screen name="index" options={{ headerShown: false }} />
              </Stack>
              <StatusBar />
            </SafeAreaProvider>
          </NativeBaseProvider>
        </RootSiblingParent>
      </TRPCProvider>
    </SessionContextProvider>
  );
}
