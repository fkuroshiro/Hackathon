// src/screens/QuestsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { getQuests } from "../services/quests";

export default function QuestsScreen() {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQuests();
  }, []);

  async function loadQuests() {
    setError(null);
    setLoading(true);
    try {
      const data = await getQuests();
      setQuests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error loading quests", err);
      setError(err.message || "Failed to load quests");
      setQuests([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.infoText}>Loading quests…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadQuests}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!quests.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>No quests yet 🥲</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      {item.description ? (
        <Text style={styles.description}>{item.description}</Text>
      ) : null}
      <View style={styles.metaRow}>
        <Text style={styles.xpText}>+{item.xp_reward} XP</Text>
        {item.is_daily && <Text style={styles.tag}>Daily</Text>}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={quests}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  infoText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  retryText: {
    fontWeight: "600",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  xpText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tag: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "#eee",
  },
});
