import React, { useEffect } from "react";
import { View } from "react-native";
import {
  SplashScreen,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { useSession } from "@supabase/auth-helpers-react";

import LoadingComponent from "~/components/LoadingComponent";

const Index = () => {
  const session = useSession();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const isPublicPage = segments[0] === "(public)";
  const isAuthenticated = session !== null;
  useEffect(() => {
    if (!navigationState?.key) return;

    if (!isPublicPage && !isAuthenticated) {
      router.replace("/onboarding");
    } else if (isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, isPublicPage, navigationState?.key]);
  return (
    <View className="flex-1">
      {navigationState?.key ? <SplashScreen /> : <LoadingComponent />}
    </View>
  );
};

export default Index;
