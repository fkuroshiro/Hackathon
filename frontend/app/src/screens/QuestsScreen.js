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
import SafeScreen from "../components/SafeScreen";
import Colors from "../theme/Colors";
import { useColorScheme } from "react-native";



export default function QuestsScreen() {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scheme = useColorScheme(); // "light" or "dark"
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;

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
    <View style={[styles.card, { backgroundColor: themeColors.card, shadowColor: themeColors.border, shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.8, shadowRadius: 8 }]}>
      <Text style={[styles.cardTitle, { color: themeColors.text }]}>{item.name}</Text>
      {item.description ? (
        <Text style={[styles.description, {color: themeColors.text}]}>{item.description}</Text>
      ) : null}
      <View style={styles.metaRow}>
        <Text style={[styles.xpText, { color: themeColors.primary }]}>+{item.xp_reward} XP</Text>
        {item.is_daily && <Text style={styles.tag}>Daily</Text>}
      </View>
    </View>
  );

  return (
    <SafeScreen style={styles.container}>
      <Text style={[styles.title]}>Weekly Quests</Text>
      <FlatList
        data={quests}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeScreen>
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    margin: 8,
    padding: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
    paddingBottom: 10,
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
    backgroundColor: "#bbbb",
  },
});
