// src/screens/LeaderboardScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getLeaderboard } from "../services/leaderboard";

import Colors from "../theme/Colors";
import { useColorScheme } from "react-native";

export default function LeaderboardScreen() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scheme = useColorScheme(); // "light" or "dark"
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    setError(null);
    setLoading(true);
    try {
      const data = await getLeaderboard();
      setPlayers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error loading leaderboard", err);
      setError(err.message || "Failed to load leaderboard");
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Leaderboard</Text>
      <Text style={styles.headerSubtitle}>Top explorers by XP</Text>
    </View>
  );

  const renderItem = ({ item, index }) => {
    const rank = index + 1;
    const isTop3 = rank <= 3;
    const isMe = item.is_me; // optional flag from backend

    const rankIcon =
      rank === 1
        ? "trophy"
        : rank === 2
        ? "trophy-outline"
        : rank === 3
        ? "medal-outline"
        : null;

    return (
      <View
        style={[
          styles.row,
          isTop3 && styles.rowTop3,
          isMe && styles.rowMe,
          { backgroundColor: themeColors.background}
        ]}
      >
        <View style={[styles.rankContainer, { backgroundColor: themeColors.background }]}>
          {rankIcon ? (
            <Ionicons
              name={rank === 1 ? "trophy" : rankIcon}
              size={20}
              color={rank === 1 ? "#FACC15" : "#A1A1AA"}
            />
          ) : (
            <Text style={styles.rankText}>{rank}</Text>
          )}
        </View>

        <View style={styles.avatarWrapper}>
          {item.avatar_url ? (
            <Image
              source={{ uri: item.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>
                {item.display_name?.[0]?.toUpperCase() || "?"}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={[styles.nameText, { color: themeColors.text }]} numberOfLines={1}>
              {item.display_name || "Unknown"}
            </Text>
            <Text style={styles.levelText}>Lv {item.level ?? "?"}</Text>
          </View>
          <View style={styles.xpRow}>
            <Text style={styles.xpText}>{item.total_xp ?? 0} XP</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.infoText}>Loading leaderboard…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!players.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>No players yet 🥲</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      {renderHeader()}
      <FlatList
        data={players}
        keyExtractor={(item, index) => String(item.id ?? index)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const AVATAR_SIZE = 40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  rowTop3: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  rowMe: {
    borderWidth: 1,
    borderColor: "#22C55E",
    backgroundColor: "#DCFCE7",
  },
  rankContainer: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 16,
    fontWeight: "600",
  },
  avatarWrapper: {
    width: AVATAR_SIZE + 4,
    height: AVATAR_SIZE + 4,
    borderRadius: (AVATAR_SIZE + 4) / 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 10,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4B5563",
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  levelText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  xpRow: {
    marginTop: 2,
  },
  xpText: {
    fontSize: 13,
    color: "#6B7280",
  },
});
