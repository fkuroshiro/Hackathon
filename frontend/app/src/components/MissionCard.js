// src/components/MissionCard.js
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function MissionCard({ mission, onComplete }) {
  return (
    <View style={[styles.card, mission.completed && styles.cardCompleted]}>
      <Text style={styles.title}>{mission.title}</Text>
      <Text style={styles.desc}>{mission.description}</Text>
      <Text style={styles.rewards}>
        +{mission.xpReward} XP • +{mission.coinReward} coins
      </Text>
      <View style={styles.footer}>
        <Text style={styles.type}>{mission.type.toUpperCase()}</Text>
        <TouchableOpacity
          style={[
            styles.button,
            mission.completed && { backgroundColor: "#aaa" },
          ]}
          onPress={onComplete}
          disabled={mission.completed}
        >
          <Text style={styles.buttonText}>
            {mission.completed ? "Completed" : "Complete"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardCompleted: {
    opacity: 0.6,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    marginBottom: 8,
  },
  rewards: {
    fontSize: 13,
    marginBottom: 8,
    color: "#4CAF50",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  type: {
    fontSize: 12,
    textTransform: "uppercase",
    opacity: 0.6,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
