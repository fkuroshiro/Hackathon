// src/navigation/TabNavigator.js
import React from "react";
import { useColorScheme } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import MapScreen from "../screens/MapScreen";
import QuestsScreen from "../screens/QuestsScreen";
import ProfileScreen from "../screens/ProfileScreen";

import Colors from "../theme/Colors";


const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const scheme = useColorScheme(); // "light" or "dark"
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = "ellipse";

          if (route.name === "Quests") iconName = "list-outline";
          if (route.name === "Map") iconName = "map-outline";
          if (route.name === "Profile") iconName = "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          position: "absolute",
          height: 40,
          marginHorizontal: 25,
          marginBottom: 16,
          padding: 10,
          borderRadius: 16,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOpacity: 1.0,
          shadowRadius: 10,
          elevation: 1,
          backgroundColor: themeColors.background, // or just "#fff"
        },
      })}
    >
      <Tab.Screen name="Quests" component={QuestsScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
