// src/screens/MissionsScreen.js
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useGame } from "../context/GameContext";
import MissionCard from "../components/MissionCard";

export default function MissionsScreen() {
  const { missions, completeMission } = useGame();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Missions</Text>
      {missions.map((mission) => (
        <MissionCard
          key={mission.id}
          mission={mission}
          onComplete={() => completeMission(mission.id)}
        />
      ))}
      {missions.length === 0 && (
        <View style={{ marginTop: 20 }}>
          <Text>No missions yet. Add some in GameContext.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
});
