// src/screens/MapScreen.js
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapScreen() {
  const region = {
    latitude: 50.0755,      // example: Prague
    longitude: 14.4378,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region}>
        <Marker
          coordinate={{ latitude: region.latitude, longitude: region.longitude }}
          title="My Location"
          description="Example marker in the city"
        />
      </MapView>
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
});
