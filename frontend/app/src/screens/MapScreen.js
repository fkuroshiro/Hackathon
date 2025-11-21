// MapScreen.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import { fetchNearbyEvents } from "./events"; // adjust path if needed

const DEFAULT_REGION_DELTA = {
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [events, setEvents] = useState([]); // always array to avoid .map error
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const requestLocationAndLoadEvents = useCallback(async () => {
    setError(null);
    setLoadingLocation(true);
    setLoadingEvents(false);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied");
        setLoadingLocation(false);
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = current.coords;
      const locObj = { latitude, longitude };
      setLocation(locObj);
      setLoadingLocation(false);

      // Now fetch events
      setLoadingEvents(true);

      const data = await fetchNearbyEvents({
        latitude,
        longitude,
        radiusKm: 5.0, // tweak if you want a bigger radius
      });

      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        console.warn("Unexpected events response shape:", data);
        setEvents([]);
      }
    } catch (err) {
      console.error("Error loading location/events:", err);
      setError(err.message || "Failed to load events");
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    requestLocationAndLoadEvents();
  }, [requestLocationAndLoadEvents]);

  const onMarkerPress = (eventObj) => {
    setSelectedEvent(eventObj);
  };

  const renderBottomCard = () => {
    if (!selectedEvent) return null;

    return (
      <View style={styles.bottomCard}>
        <Text style={styles.eventTitle}>{selectedEvent.title}</Text>
        {selectedEvent.description ? (
          <Text style={styles.eventDescription}>
            {selectedEvent.description}
          </Text>
        ) : null}
        {selectedEvent.reward_text ? (
          <Text style={styles.rewardText}>{selectedEvent.reward_text}</Text>
        ) : null}
        {selectedEvent.category ? (
          <Text style={styles.categoryText}>#{selectedEvent.category}</Text>
        ) : null}
        {selectedEvent.is_official ? (
          <Text style={styles.officialBadge}>Official event</Text>
        ) : null}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setSelectedEvent(null)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderBody = () => {
    if (loadingLocation) {
      return (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.infoText}>Getting your location…</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={requestLocationAndLoadEvents}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!location) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>Location not available</Text>
        </View>
      );
    }

    return (
      <>
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={{
            ...location,
            ...DEFAULT_REGION_DELTA,
          }}
          showsUserLocation
        >
          {Array.isArray(events) &&
            events.map((ev) => (
              <Marker
                key={ev.id}
                coordinate={{
                  latitude: ev.latitude,
                  longitude: ev.longitude,
                }}
                title={ev.title}
                description={ev.description || ""}
                onPress={() => onMarkerPress(ev)}
              />
            ))}
        </MapView>
        {loadingEvents && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator />
            <Text style={styles.infoText}>Loading events…</Text>
          </View>
        )}
        {renderBottomCard()}
      </>
    );
  };

  return <View style={styles.container}>{renderBody()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    marginTop: 8,
    fontSize: 14,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  retryButtonText: {
    fontWeight: "600",
  },
  loadingOverlay: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bottomCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    elevation: 4,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 13,
    fontStyle: "italic",
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: "#555",
    marginBottom: 4,
  },
  officialBadge: {
    fontSize: 12,
    color: "#fff",
    backgroundColor: "#000",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 8,
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  closeButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default MapScreen;
