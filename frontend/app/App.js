// App.js
import TabNavigator from "./src/navigation/TabNavigator";
import { GameProvider } from "./src/context/GameContext";

export default function App() {
  return (
    <GameProvider>
      <TabNavigator />
    </GameProvider>
  );
}
