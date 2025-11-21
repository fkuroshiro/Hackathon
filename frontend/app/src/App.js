// App.js
import { ExpoRoot } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import SafeScreen from "./components/SafeScreen";

import TabNavigator from "./components/TabNavigator";
import { GameProvider } from "./context/GameContext";
import Colors from "./theme/Colors";

export default function App() {
  const scheme = useColorScheme(); // "light" or "dark"
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;

  return (
    <GameProvider>
      <SafeScreen themeColors={themeColors} style={{ backgroundColor: themeColors.background }} >
        <TabNavigator />
      </SafeScreen>
    </GameProvider>
  );
}