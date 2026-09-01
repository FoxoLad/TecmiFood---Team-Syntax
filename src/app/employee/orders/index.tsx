import { Text, View } from "react-native";

export default function EmployeeOrdersScreen() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#DFCDB2" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Vista del empleado</Text>
            <Text style={{ marginTop: 8, fontSize: 16 }}>Pedidos y órdenes</Text>
        </View>
    );
}
