// src/screens/LeaderboardScreen.js
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useGame } from "../context/GameContext";

export default function LeaderboardScreen() {
  const { leaderboard } = useGame();

  const sorted = [...leaderboard].sort((a, b) => b.xp - a.xp);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.row,
              item.id === "me" && styles.meRow,
            ]}
          >
            <Text style={styles.rank}>{index + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {item.name} {item.id === "me" ? " (You)" : ""}
              </Text>
              <Text style={styles.xp}>
                Level {item.level} • {item.xp} XP
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  meRow: {
    backgroundColor: "#f0f8ff",
  },
  rank: {
    width: 30,
    fontWeight: "bold",
    fontSize: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  xp: {
    fontSize: 12,
    opacity: 0.7,
  },
});
