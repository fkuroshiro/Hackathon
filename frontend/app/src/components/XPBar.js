// src/components/XPBar.js
import { View, Text, StyleSheet } from "react-native";

export default function XPBar({ xp, level }) {
  const currentLevelXP = (level - 1) * 100;
  const nextLevelXP = level * 100;
  const progress = Math.min(
    (xp - currentLevelXP) / (nextLevelXP - currentLevelXP || 1),
    1
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.level}>Level {level}</Text>
        <Text style={styles.xpText}>{xp} XP</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { flex: progress }]} />
        <View style={{ flex: 1 - progress }} />
      </View>
      <Text style={styles.toNext}>
        {nextLevelXP - xp > 0
          ? `${nextLevelXP - xp} XP to next level`
          : "Max level for demo 😎"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  level: {
    fontSize: 18,
    fontWeight: "bold",
  },
  xpText: {
    fontSize: 14,
    opacity: 0.8,
  },
  barBackground: {
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    backgroundColor: "#eee",
    overflow: "hidden",
  },
  barFill: {
    backgroundColor: "#4CAF50",
    borderRadius: 6,
  },
  toNext: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
});
