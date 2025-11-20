// App.js
import TabNavigator from "./navigation/TabNavigator";
import { GameProvider } from "./context/GameContext";
import { useColorScheme } from "react-native";
import Colors from "./src/theme/colors";

const scheme = useColorScheme();  // "light" | "dark"

const Theme = scheme === "dark" ? Colors.dark : Colors.light;

export default function App() {
  return (
    <GameProvider>
      <TabNavigator />
    </GameProvider>
  );
}
