import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SafeView from "../../../components/SafeView";



export default function HomeScreen() {
    const { name } = useLocalSearchParams<{ name: string }>();

    return (
        <SafeView style={styles.container}>
            <Pressable
                accessibilityLabel={`Volver a cafeterías`}
                accessibilityRole="button"
                onPress={() => router.back()}
                style={styles.backButton}
            >
                <Ionicons name="arrow-back" size={40} color="black" />
            </Pressable>

            <Text style={styles.title}>{name}</Text>

            <View style = {styles.buttonRow}>
                <Pressable style={styles.menubutton} onPress={() => {}}>
                    <Text style={styles.buttonText}>ALIMENTOS</Text>
                </Pressable>

                <Pressable style={styles.menubutton} onPress={() => {}}>
                    <Text style={styles.buttonText}>BEBIDAS</Text>
                </Pressable>

                <Pressable style={styles.menubutton} onPress={() => {}}>
                    <Text style={styles.buttonText}>OTROS</Text>
                </Pressable>
            </View>

            <Text>Menú completo de la cafeteria</Text>

        </SafeView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#ffffff",
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        textAlign: "center",
        width: "100%",
        borderBottomColor: "rgba(0, 0, 0, 0.65)",
        borderBottomWidth: 1,
        marginBottom: 20,
        paddingBottom: 8,
    },
    backButton: {
        position: "absolute",
        top: 60,
        left: 16,
        zIndex: 1,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 20,
        marginTop: 20,
    },
    menubutton: {
        alignItems: "center",
        backgroundColor: "#cbc583",
        borderRadius: 8,
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    
    buttonText: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "bold",
    },
});

