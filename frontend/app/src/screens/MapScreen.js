// src/screens/MapScreen.js
import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";

import SafeScreen from "../components/SafeScreen";

import { getEvents } from "../services/events";
import { getLeaderboard } from "../services/leaderboard";

import Colors from "../theme/Colors";
import { useColorScheme } from "react-native";


export default function MapScreen({ navigation }) {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [topPlayer, setTopPlayer] = useState(null);
  const [loadingTopPlayer, setLoadingTopPlayer] = useState(true);

  const scheme = useColorScheme(); // "light" or "dark"
  const themeColors = scheme === "dark" ? Colors.dark : Colors.light;

  const brnoRegion = {
    latitude: 49.1951,
    longitude: 16.6068,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  useEffect(() => {
    loadEvents();
    loadTopPlayer();
  }, []);

  async function loadEvents() {
    try {
      const data = await getEvents(); // your existing service
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error loading events", err);
    } finally {
      setLoadingEvents(false);
    }
  }

  async function loadTopPlayer() {
    try {
      const lb = await getLeaderboard();
      if (Array.isArray(lb) && lb.length > 0) {
        setTopPlayer(lb[0]); // first person in leaderboard
      }
    } catch (err) {
      console.log("Error loading leaderboard for map banner", err);
    } finally {
      setLoadingTopPlayer(false);
    }
  }

  const handleUserLocationChange = (event) => {
    const { coordinate } = event.nativeEvent;
    setUserLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  };

  const goToMyLocation = () => {
    if (!userLocation || !mapRef.current) return;

    mapRef.current.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500
    );
  };

  const openLeaderboard = () => {
    navigation.navigate("Leaderboard");
  };

  if (loadingEvents) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeScreen style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.container}>
      {/* MAP */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={brnoRegion}
        showsUserLocation
        onUserLocationChange={handleUserLocationChange}
      >
        {events.map((ev) => (
          <Marker
            key={ev.id}
            coordinate={{
              latitude: ev.latitude,
              longitude: ev.longitude,
            }}
            title={ev.title}
            description={ev.description}
          />
        ))}
      </MapView>

      {/* FLOATING TOP BAR – LEADERBOARD TOP PLAYER */}
      {!loadingTopPlayer && topPlayer && (
        <TouchableOpacity
          style={[styles.topBar, { backgroundColor: themeColors.background }]}
          activeOpacity={0.9}
          onPress={openLeaderboard}
        >
          {/* Avatar / initial */}
          <View style={styles.topBarAvatarWrapper}>
            {topPlayer.avatar_url ? (
              <Image
                source={{ uri: topPlayer.avatar_url }}
                style={styles.topBarAvatar}
              />
            ) : (
              <View style={styles.topBarAvatarPlaceholder}>
                <Text style={styles.topBarAvatarInitial}>
                  {topPlayer.name?.[0]?.toUpperCase() || "?"}
                </Text>
              </View>
            )}
          </View>

          {/* Info */}
          <View style={[styles.topBarTextContainer, { backgroundColor: themeColors.background }]}>
            <Text style={[styles.topBarTitle, { color: themeColors.text }]} numberOfLines={1}>
              #{1} {topPlayer.display_name}
            </Text>
            <Text style={styles.topBarSubtitle} numberOfLines={1}>
              Lv {topPlayer.level ?? "?"} · {topPlayer.total_xp ?? 0} XP
            </Text>
          </View>

          {/* Icon */}
          <Ionicons name="trophy" size={22} color="#FACC15" />
        </TouchableOpacity>
      )}

      {/* MY LOCATION BUTTON */}
      <TouchableOpacity
        style={[styles.myLocationButton, { backgroundColor: themeColors.card, shadowColor: themeColors.border, shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.8, shadowRadius: 4, transform: [{ translateY: -50}] }]}
        onPress={goToMyLocation}
      >
        <Ionicons name="locate" size={26} color={themeColors.primary} />
      </TouchableOpacity>
    </View>
    </SafeScreen>
  );
}

const AVATAR_SIZE = 34;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  myLocationButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 999,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  // TOP BAR
  topBar: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  topBarAvatarWrapper: {
    marginRight: 10,
  },
  topBarAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  topBarAvatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  topBarAvatarInitial: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4B5563",
  },
  topBarTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  topBarTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  topBarSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});
