// src/screens/HomeScreen.js
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useGame } from "../context/GameContext";
import XPBar from "../components/XPBar";

export default function HomeScreen() {
  const { user, missions } = useGame();

  const completedCount = missions.filter((m) => m.completed).length;
  const activeCount = missions.length - completedCount;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hey, {user.name} 👋</Text>
      <XPBar xp={user.xp} level={user.level} />

      <View style={styles.row}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Coins</Text>
          <Text style={styles.statValue}>{user.coins}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Active Missions</Text>
          <Text style={styles.statValue}>{activeCount}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{completedCount}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Today’s Goal</Text>
      <Text>Complete at least 1 mission to keep your streak alive 🔥</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 16,
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 4,
    fontWeight: "bold",
  },
});
