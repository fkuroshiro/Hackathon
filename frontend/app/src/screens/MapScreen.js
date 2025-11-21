// src/screens/MapScreen.js
import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getEvents } from "../services/events";


export default function MapScreen() {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);


  const brnoRegion = {
    latitude: 49.1951,
    longitude: 16.6068,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const data = await getEvents(); // defaults to Brno coords
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error loading events", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
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

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={brnoRegion}
        showsUserLocation
        onUserLocationChange={handleUserLocationChange}
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
              description={ev.description}
            />
          ))}
      </MapView>

      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={goToMyLocation}
      >
        <Ionicons name="locate" size={26} color={"#9F7AEA"}/>
      </TouchableOpacity>
    </View>
  );
}

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
    backgroundColor: "#121214",
    padding: 10,
    borderRadius: 999,
    elevation: 5,
    shadowColor: "#121214",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
