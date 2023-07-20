import type { ExpoConfig } from "@expo/config";

const SUPABASE_URL = "https://yowdtkcnjpfigaxbmdee.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvd2R0a2NuanBmaWdheGJtZGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ2MTY4NDYsImV4cCI6MjAwMDE5Mjg0Nn0.unx5UbypypelsoJSZWsISK_h-bBJlf83jVGLlZ72_EQ";

if (typeof SUPABASE_URL !== "string" || typeof SUPABASE_ANON_KEY !== "string") {
  throw new Error("Missing Supabase URL or anonymous key");
}

const defineConfig = (): ExpoConfig => ({
  name: "sino",
  slug: "sino",
  scheme: "expo",
  owner: "jagand",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/app-icon.png",
  userInterfaceStyle: "dark",

  updates: {
    url: "https://u.expo.dev/11f431cb-7866-41f7-bec3-d04ed1c32c93",
  },
  runtimeVersion: {
    policy: "sdkVersion",
  },

  splash: {
    image: "./assets/app-icon.png",
    resizeMode: "contain",
    backgroundColor: "#18181A",
  },

  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "your.bundle.identifier",
  },
  android: {
    package: "com.sinoremit",
    adaptiveIcon: {
      foregroundImage: "./assets/app-icon.png",
      backgroundColor: "#18181A",
    },
  },
  extra: {
    eas: {
      projectId: "11f431cb-7866-41f7-bec3-d04ed1c32c93",
    },
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
  },
  plugins: [
    "./expo-plugins/with-modify-gradle.js",
    "expo-apple-authentication",
  ],
});

export default defineConfig;
