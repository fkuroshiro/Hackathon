// src/navigation/TabNavigator.js
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";


import MapScreen from "../screens/MapScreen";
import MissionsScreen from "../screens/MissionsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]} backgroundColor="#252424ff">
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

            return <Ionicons name={iconName} size={28} color={color} />;
          },

          tabBarActiveTintColor: "#8400ffff",
          tabBarInactiveTintColor: "#ffffff",
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            shadowColor: "#000",
            borderColor: "#252424ff",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 1.0,
            shadowRadius: 10,
            elevation: 1,
            backgroundColor: "#252424ff",
          },
        })}
      >
        <Tab.Screen name="Missions" component={MissionsScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
