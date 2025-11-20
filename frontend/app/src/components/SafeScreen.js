import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

export default function SafeScreen({ children, style, edges = ["top"] }) {
  return (
    <SafeAreaView style={[styles.container, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
