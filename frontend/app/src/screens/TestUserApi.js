// src/screens/TestApiScreen.js
import React from "react";
import { View, Text, Button, Alert } from "react-native";
import { testBackend } from "../services/test";

export default function TestApiScreen() {
  const handlePress = async () => {
    try {
      const data = await testBackend();
      Alert.alert("Success", "Got data: " + JSON.stringify(data));
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Button title="Test /users" onPress={handlePress} />
      <Text style={{ marginTop: 10 }}>Check Metro logs for details</Text>
    </View>
  );
}
