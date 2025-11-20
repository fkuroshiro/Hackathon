// App.js
import TabNavigator from "./navigation/TabNavigator";
import { GameProvider } from "./context/GameContext";

export default function App() {
  return (
    <GameProvider>
      <TabNavigator />
    </GameProvider>
  );
}
