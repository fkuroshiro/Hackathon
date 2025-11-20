import React, { useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function MapScreen() {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  const brnoRegion = {
    latitude: 49.1951,
    longitude: 16.6068,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

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
      700
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={brnoRegion}
        showsUserLocation={true}
        onUserLocationChange={handleUserLocationChange}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You"
            description="Your current location"
          />
        )}
      </MapView>

      <TouchableOpacity style={styles.myLocationButton} onPress={goToMyLocation}>
        <Ionicons name="locate" size={26} color="#007AFF" />
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
});
