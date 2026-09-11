import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../constants/theme";

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
    backgroundColor: colors.background,
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
