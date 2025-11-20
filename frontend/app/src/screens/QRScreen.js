// src/screens/QRScreen.js
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useGame } from "../context/GameContext";

export default function QRScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [message, setMessage] = useState("");
  const { completeMissionByQRCode } = useGame();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    const result = completeMissionByQRCode(data);
    setMessage(result.message);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission…</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text>No camera access. Enable it in settings.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Quest</Text>
      <Text style={styles.subtitle}>
        Scan the event QR code to complete a special mission.
      </Text>

      <View style={styles.scannerBox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      {scanned && (
        <Button title="Tap to scan again" onPress={() => {
          setScanned(false);
          setMessage("");
        }} />
      )}

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 16,
    opacity: 0.8,
  },
  scannerBox: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#007AFF",
    marginBottom: 16,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
});
