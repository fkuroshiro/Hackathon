// src/components/BadgePill.js
import { View, Text, StyleSheet } from "react-native";

export default function BadgePill({ badge, unlocked }) {
  return (
    <View style={[styles.badge, !unlocked && styles.locked]}>
      <Text style={styles.name}>{badge.name}</Text>
      <Text style={styles.desc}>{badge.description}</Text>
      {!unlocked && <Text style={styles.lockText}>Locked</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#f1f1f1",
    marginBottom: 8,
  },
  locked: {
    opacity: 0.5,
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
  },
  desc: {
    fontSize: 12,
    opacity: 0.8,
  },
  lockText: {
    fontSize: 11,
    marginTop: 4,
    fontStyle: "italic",
  },
});
