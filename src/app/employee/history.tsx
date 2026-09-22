import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radii } from "../../constants/theme";

type Stats = {
    today: number;
    week: number;
    month: number;
    allTime: number;
    totalOrders: number;
};

export default function EmployeeHistoryScreen() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = async () => {
        try {
            const res = await fetch("https://tecmifood-team-syntax.onrender.com/api/orders/metrics/stats");
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchStats();
        setRefreshing(false);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    accessibilityLabel="Volver"
                    accessibilityRole="button"
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons color="#111110" name="chevron-back" size={30} />
                    <Text style={styles.backText}>Volver</Text>
                </Pressable>
                <Text style={styles.title}>Métricas</Text>
            </View>

            <ScrollView 
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <Text style={styles.sectionTitle}>Historial de Ganancias</Text>
                
                {isLoading && !stats ? (
                    <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 50 }} />
                ) : stats ? (
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <View style={styles.statHeader}>
                                <Ionicons name="today-outline" size={24} color={colors.accent} />
                                <Text style={styles.statTitle}>Hoy</Text>
                            </View>
                            <Text style={styles.statValue}>${stats.today.toFixed(2)}</Text>
                        </View>

                        <View style={styles.statCard}>
                            <View style={styles.statHeader}>
                                <Ionicons name="calendar-outline" size={24} color={colors.accent} />
                                <Text style={styles.statTitle}>Esta Semana</Text>
                            </View>
                            <Text style={styles.statValue}>${stats.week.toFixed(2)}</Text>
                        </View>

                        <View style={styles.statCard}>
                            <View style={styles.statHeader}>
                                <Ionicons name="calendar-number-outline" size={24} color={colors.accent} />
                                <Text style={styles.statTitle}>Este Mes</Text>
                            </View>
                            <Text style={styles.statValue}>${stats.month.toFixed(2)}</Text>
                        </View>

                        <View style={[styles.statCard, styles.highlightCard]}>
                            <View style={styles.statHeader}>
                                <Ionicons name="cash-outline" size={24} color="#ffffff" />
                                <Text style={[styles.statTitle, { color: "#ffffff" }]}>Total Histórico</Text>
                            </View>
                            <Text style={[styles.statValue, { color: "#ffffff" }]}>${stats.allTime.toFixed(2)}</Text>
                            <Text style={styles.statSubtitle}>({stats.totalOrders} pedidos entregados)</Text>
                        </View>
                    </View>
                ) : (
                    <Text style={styles.errorText}>No se pudieron cargar las estadísticas.</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        alignItems: "center",
        borderBottomColor: colors.border,
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        alignItems: "center",
        flexDirection: "row",
    },
    backText: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: -1,
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: colors.text,
    },
    statsContainer: {
        gap: 16,
    },
    statCard: {
        backgroundColor: colors.surface,
        borderRadius: radii.large,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    highlightCard: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    statHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    statTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 10,
        color: colors.textSecondary,
    },
    statValue: {
        fontSize: 32,
        fontWeight: "800",
        color: colors.text,
    },
    statSubtitle: {
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
        marginTop: 4,
    },
    errorText: {
        fontSize: 16,
        color: colors.danger,
        textAlign: "center",
        marginTop: 20,
    }
});
