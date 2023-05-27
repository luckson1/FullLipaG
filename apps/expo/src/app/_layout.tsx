import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { NativeBaseProvider } from "native-base";

import { TRPCProvider } from "../utils/api";
import { supabase } from "../utils/supabase";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <TRPCProvider>
        <NativeBaseProvider>
          <SafeAreaProvider>
            {/*
             * The Stack component displays the current page.
             * It also allows you to configure your screens
             */}
            <Stack>
              {/*
               * Present the profile screen as a modal
               * @see https://expo.github.io/router/docs/guides/modals
               */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar />
          </SafeAreaProvider>
        </NativeBaseProvider>
      </TRPCProvider>
    </SessionContextProvider>
  );
}
