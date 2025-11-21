// src/screens/ProfileScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import SafeScreen from "../components/SafeScreen";

import Colors from "../theme/Colors";
import { useColorScheme } from "react-native";


export default function ProfileScreen() {
  const scheme = useColorScheme(); // "light" or "dark"
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;

  // You can later replace this with real data from your backend / context
  const user = {
    name: "John Doe",
    age: 22,
    sex: "Male",
    bio: "Exploring events around Brno, meeting new people, and collecting XP.",
    level: 7,
    xp: 340,
    nextLevelXp: 500, // XP needed for next level
    hasPositiveReputation: true,
    photos: [
      "https://images.pexels.com/photos/2775529/pexels-photo-2775529.jpeg",
      "https://images.pexels.com/photos/3151913/pexels-photo-3151913.jpeg",
      "https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg",
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg",
    ],
  };

  const xpProgress =
    user.nextLevelXp > 0 ? Math.min(user.xp / user.nextLevelXp, 1) : 0;

  return (
    <SafeScreen style={styles.container}>
      {/* Top profile section */}
      <View style={[styles.topSection, { backgroundColor: themeColors.card, borderRadius: 12, padding: 12, marginBottom: 16, shadowColor: themeColors.border, shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.8, shadowRadius: 4 }]}>
        {/* Avatar */}
        <View
          style={[
            styles.avatarWrapper,
            user.hasPositiveReputation && styles.avatarWrapperPositive,
          ]}
        >
          <Image
            source={{
              uri: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
            }}
            style={styles.avatar}
          />
        </View>

        {/* Name, age, sex, bio */}
        <View style={styles.infoContainer}>
          <Text style={[styles.nameText, { color: themeColors.primary }]}>
            {user.name} · {user.age}
          </Text>
          <Text style={[styles.sexText, { color: themeColors.text }]}>{user.sex}</Text>
          <Text style={[styles.bioText, { color: themeColors.text }]} numberOfLines={3}>
            {user.bio}
          </Text>
        </View>
      </View>

      {/* XP + Level section */}
      <View style={[styles.xpContainer, { backgroundColor: themeColors.card, shadowColor: themeColors.border, shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.8, shadowRadius: 4 }]}>
        <View style={styles.xpHeaderRow}>
          <Text style={[styles.xpLabel, { color: themeColors.text } ]}>Level {user.level}</Text>
          <Text style={[styles.xpValue, { color: themeColors.primary } ]}>
            {user.xp} / {user.nextLevelXp} XP
          </Text>
        </View>
        <View style={styles.xpBarBackground}>
          <View
            style={[styles.xpBarFill, { backgroundColor: themeColors.primary, shadowColor: themeColors.primary, shadowOffset: { width: 5, height: 0}, shadowOpacity: 0.8, shadowRadius: 5, flex: xpProgress, maxWidth: "100%" }]}
          />
          <View
            style={[
              styles.xpBarFillRemainder,
              { flex: 1 - xpProgress, display: xpProgress < 1 ? "flex" : "none" },
            ]}
          />
        </View>
      </View>

      {/* Buttons: Badges & Hobbies */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.chipButton}>
          <Text style={styles.chipButtonText}>Badges</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chipButton}>
          <Text style={styles.chipButtonText}>Hobbies</Text>
        </TouchableOpacity>
      </View>

      {/* Photos horizontal ScrollView */}
      <View style={[styles.photosSection, { backgroundColor: themeColors.card, borderRadius: 12, padding: 20, shadowColor: themeColors.border, shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.8, shadowRadius: 4 }]}>
        <Text style={[styles.photosTitle, { color: themeColors.text }]}>Photos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photosScrollContent}
        >
          {user.photos.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.photoItem} />
          ))}
        </ScrollView>
      </View>
    </SafeScreen>
  );
}

const AVATAR_SIZE = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
    paddingHorizontal: 16,
  },
  topSection: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  avatarWrapper: {
    width: AVATAR_SIZE + 10,
    height: AVATAR_SIZE + 10,
    borderRadius: (AVATAR_SIZE + 10) / 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  avatarWrapperPositive: {
    borderColor: "#28C76F", // green outline for +reputation
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "700",
  },
  sexText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  bioText: {
    fontSize: 14,
    color: "#444",
    marginTop: 6,
  },

  xpContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  xpHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    alignItems: "center",
  },
  xpLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  xpValue: {
    fontSize: 13,
    color: "#666",
  },
  xpBarBackground: {
    flexDirection: "row",
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#E2E2E2",
  },
  xpBarFill: {
    backgroundColor: "#FF9F43",
  },
  xpBarFillRemainder: {
    backgroundColor: "transparent",
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  chipButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#DDD",
    marginHorizontal: 4,
    backgroundColor: "white",
    alignItems: "center",
  },
  chipButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },

  photosSection: {
    height: 440,
  },
  photosTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  photosScrollContent: {
    paddingVertical: 4,
  },
  photoItem: {
    width: 250,
    height: 350,
    borderRadius: 12,
    marginRight: 10,
  },
});
