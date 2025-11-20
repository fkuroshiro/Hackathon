// src/screens/ProfileScreen.js
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useGame } from "../context/GameContext";
import XPBar from "../components/XPBar";
import BadgePill from "../components/BadgePill";

export default function ProfileScreen() {
  const { user, badges } = useGame();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.name}>{user.name}</Text>
      <XPBar xp={user.xp} level={user.level} />

      <View style={styles.statRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Level</Text>
          <Text style={styles.statValue}>{user.level}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Coins</Text>
          <Text style={styles.statValue}>{user.coins}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Badges</Text>
      {badges.map((badge) => (
        <BadgePill
          key={badge.id}
          badge={badge}
          unlocked={user.badgeIds.includes(badge.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statRow: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    marginRight: 8,
    padding: 12,
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
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 12,
  },
});
