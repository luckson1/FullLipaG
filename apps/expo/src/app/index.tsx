import React, { useEffect } from "react";
import { View } from "react-native";
import Toast from "react-native-root-toast";
import {
  SplashScreen,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { useSessionContext } from "@supabase/auth-helpers-react";

import LoadingComponent from "~/components/LoadingComponent";

const Index = () => {
  const { session, isLoading, error } = useSessionContext();
  const errorMessage = error?.message;
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const isPublicPage = segments[0] === "(public)";
  const isAuthenticated = session !== null;
  useEffect(() => {
    if (!navigationState?.key) return;
    if (errorMessage) {
      Toast.show(errorMessage, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        backgroundColor: "white",
        hideOnPress: true,
        textColor: "red",
        delay: 0,
      });
    }
    if (!isPublicPage && !isAuthenticated && !isLoading) {
      router.replace("/onboarding");
    } else if (isAuthenticated) {
      router.replace("/home");
    }
  }, [
    isAuthenticated,
    isPublicPage,
    navigationState?.key,
    router,
    isLoading,
    errorMessage,
  ]);
  return (
    <View className="flex-1">
      {navigationState?.key || isLoading ? (
        <SplashScreen />
      ) : (
        <LoadingComponent />
      )}
    </View>
  );
};

export default Index;
