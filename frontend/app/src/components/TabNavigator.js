// src/navigation/TabNavigator.js
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "react-native";


import MapScreen from "../screens/MapScreen";
import MissionsScreen from "../screens/MissionsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TestUserApi from "../screens/TestUserApi";

import Colors from "../theme/Colors";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const scheme = useColorScheme(); // "light" or "dark"
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;

  return (
      <NavigationContainer>
        <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,

          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Map") {
              iconName = focused ? "map" : "map-outline";
            } else if (route.name === "Missions") {
              iconName = focused ? "flag" : "flag-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            } 
            // else if (route.name === "TestUserApi") {
            //   iconName = focused ? "person" : "person-outline";
            // }

            return <Ionicons name={iconName} size={28} color={color} />;
          },

          tabBarActiveTintColor: themeColors.primary,
          tabBarInactiveTintColor: themeColors.textMuted,
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            shadowColor: themeColors.border,
            borderColor: themeColors.border,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 1.0,
            shadowRadius: 10,
            elevation: 1,
            backgroundColor: themeColors.background,
          },
        })}
      >
        <Tab.Screen name="Missions" component={MissionsScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        {/* <Tab.Screen name="TestUserApi" component={TestUserApi} /> */}
      </Tab.Navigator>
      </NavigationContainer>
  );
}
