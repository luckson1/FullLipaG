import React from "react";
import { Pressable } from "react-native";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const _layout = () => {
  function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
  }) {
    return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
  }
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: "Overview",
          tabBarButton: (props) => (
            <Pressable
              android_ripple={{
                color: "rgb(100 116 139 / var(--tw-bg-opacity))",
                radius: 40,
              }}
              {...props}
            />
          ),
          headerTitleAlign: "center",

          tabBarStyle: { backgroundColor: "#f8fafc" },
          headerTitleStyle: { fontSize: 16 },
          tabBarActiveTintColor: "rgb(45 212 191)",
          tabBarInactiveTintColor: "#94a3b8",
          tabBarLabelStyle: { fontSize: 14 },

          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="send"
        options={{
          title: "Send",
          headerStyle: { backgroundColor: "rgb(45 212 191)" },
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 16, color: "#fff" },
          tabBarStyle: { backgroundColor: "#f8fafc" },
          tabBarActiveTintColor: "rgb(45 212 191)",
          tabBarInactiveTintColor: "#94a3b8",
          tabBarLabelStyle: { fontSize: 14 },
          tabBarButton: (props) => (
            <Pressable
              android_ripple={{
                color: "rgb(100 116 139 / var(--tw-bg-opacity))",
                radius: 40,
              }}
              {...props}
            />
          ),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="paper-plane" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipients"
        options={{
          title: "Recepients",

          headerTitleAlign: "center",

          headerStyle: { backgroundColor: " rgb(20 184 166)" },
          headerTitleStyle: { fontSize: 16, color: "#fff" },
          tabBarStyle: { backgroundColor: "#f8fafc" },
          tabBarActiveTintColor: "rgb(45 212 191)",
          tabBarInactiveTintColor: "#94a3b8",
          tabBarLabelStyle: { fontSize: 14 },
          tabBarButton: (props) => (
            <Pressable
              android_ripple={{
                color: "rgb(100 116 139 / var(--tw-bg-opacity))",
                radius: 40,
              }}
              {...props}
            />
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: " rgb(20 184 166)" },
          headerTitleStyle: { fontSize: 16, color: "#fff" },
          tabBarStyle: { backgroundColor: "#f8fafc" },
          tabBarActiveTintColor: "rgb(45 212 191)",
          tabBarInactiveTintColor: "#94a3b8",
          tabBarLabelStyle: { fontSize: 14 },
          tabBarButton: (props) => (
            <Pressable
              android_ripple={{
                color: "rgb(100 116 139 / var(--tw-bg-opacity))",
                radius: 40,
              }}
              {...props}
            />
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
};

export default _layout;
