import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductsScreen() {
  return (
    <SafeAreaView style={style.container}>
      <View style={style.centerContent}>
        <Text style={style.clientTitle}>vista cliente</Text>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFCDB2",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  clientTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333333",
  },
});
