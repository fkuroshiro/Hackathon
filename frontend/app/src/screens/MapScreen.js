// src/screens/MapScreen.js
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";


export default function MapScreen() {
  const region = {
    latitude: 49.1951,      // example: Prague
    longitude: 16.6068,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region} mapType="standard">
        <Marker
          coordinate={{ latitude: region.latitude, longitude: region.longitude }}
          title="Sigma Event"
          description="xdddddddd"
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
