import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radii } from '../../constants/theme';
import { useOrders } from '../../stores/useOrders';

type Period = 'Hoy' | 'Semana' | 'Mes' | 'Siempre';

export default function EmployeeHistoryScreen() {
    const orders = useOrders((state) => state.orders);
    const [period, setPeriod] = useState<Period>('Hoy');

    const aggregatedData = useMemo(() => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfDay);
        const dayOfWeek = startOfDay.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startOfWeek.setDate(startOfDay.getDate() - diff);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const deliveredOrders = orders.filter(o => o.status === 'Entregado');

        const periodOrders = deliveredOrders.filter(order => {
            const orderDate = new Date(order.createdAt);
            switch (period) {
                case 'Hoy': return orderDate >= startOfDay;
                case 'Semana': return orderDate >= startOfWeek;
                case 'Mes': return orderDate >= startOfMonth;
                case 'Siempre': return true;
                default: return true;
            }
        });

        const productMap: Record<string, { qty: number; price: number; total: number }> = {};
        let grandTotal = 0;

        periodOrders.forEach(order => {
            order.items.forEach(item => {
                const pName = item.name;
                if (!productMap[pName]) {
                    productMap[pName] = { qty: 0, price: item.price, total: 0 };
                }
                productMap[pName].qty += item.quantity;
                productMap[pName].total += item.price * item.quantity;
                grandTotal += item.price * item.quantity;
            });
        });

        const products = Object.entries(productMap).map(([name, data]) => ({
            name, ...data
        })).sort((a, b) => b.total - a.total);

        return { products, grandTotal, count: periodOrders.length, periodOrders };
    }, [orders, period]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    accessibilityLabel='Volver'
                    accessibilityRole='button'
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons color='#111110' name='chevron-back' size={30} />
                    <Text style={styles.backText}>Volver</Text>
                </Pressable>
                <Text style={styles.title}>Ventas</Text>
            </View>

            <View style={styles.tabsContainer}>
                {(['Hoy', 'Semana', 'Mes'] as Period[]).map((p) => (
                    <Pressable
                        key={p}
                        style={[styles.tab, period === p && styles.activeTab]}
                        onPress={() => setPeriod(p as Period)}
                    >
                        <Text style={[styles.tabText, period === p && styles.activeTabText]}>{p}</Text>
                    </Pressable>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Total Vendido ({period})</Text>
                    <Text style={styles.summaryTotal}>${aggregatedData.grandTotal.toFixed(2)}</Text>
                    <Text style={styles.summaryOrders}>{aggregatedData.count} pedidos entregados</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.th, { flex: 2 }]}>Producto</Text>
                        <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>Cant.</Text>
                        <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Total</Text>
                    </View>
                    
                    {aggregatedData.products.length === 0 ? (
                        <Text style={styles.emptyText}>No hay ventas en este periodo.</Text>
                    ) : (
                        aggregatedData.products.map((p, idx) => (
                            <View key={idx} style={styles.tableRow}>
                                <Text style={[styles.td, { flex: 2 }]} numberOfLines={2}>{p.name}</Text>
                                <Text style={[styles.td, { flex: 1, textAlign: 'center' }]}>{p.qty}</Text>
                                <Text style={[styles.td, { flex: 1, textAlign: 'right', fontWeight: 'bold' }]}>
                                    ${p.total.toFixed(2)}
                                </Text>
                            </View>
                        ))
                    )}
                </View>

                <View style={styles.recentOrdersContainer}>
                    <Text style={styles.sectionTitle}>Pedidos de {period}</Text>
                    {aggregatedData.periodOrders.length === 0 ? (
                        <Text style={styles.emptyText}>Ningún pedido para mostrar.</Text>
                    ) : (
                        aggregatedData.periodOrders.map(order => (
                            <Pressable 
                                key={order._id} 
                                style={styles.orderCard}
                                onPress={() => router.push(`/employee/orders/${order.orderNumber}`)}
                            >
                                <View style={styles.orderCardHeader}>
                                    <Text style={styles.orderNumber}>#{String(order.orderNumber).padStart(3, "0")}</Text>
                                    <Text style={styles.orderTotal}>${order.totalAmount.toFixed(2)}</Text>
                                </View>
                                <Text style={styles.orderDate}>{new Date(order.createdAt).toLocaleString("es-MX")}</Text>
                            </Pressable>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
    backButton: { alignItems: 'center', flexDirection: 'row', zIndex: 2 },
    backText: { fontSize: 18, fontWeight: '600', marginLeft: 5 },
    title: { fontSize: 22, fontWeight: 'bold', position: 'absolute', left: 0, right: 0, textAlign: 'center', zIndex: 1 },
    tabsContainer: { flexDirection: 'row', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
    activeTab: { borderBottomColor: colors.accent },
    tabText: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
    activeTabText: { color: colors.accent, fontWeight: 'bold' },
    content: { padding: 16 },
    summaryCard: { backgroundColor: colors.accent, borderRadius: radii.large, padding: 24, alignItems: 'center', marginBottom: 20 },
    summaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 8 },
    summaryTotal: { color: '#ffffff', fontSize: 36, fontWeight: 'bold', marginBottom: 4 },
    summaryOrders: { color: 'rgba(255,255,255,0.9)', fontSize: 14 },
    table: { backgroundColor: colors.surface, borderRadius: radii.large, padding: 16, borderWidth: 1, borderColor: colors.border },
    tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 10, marginBottom: 10 },
    th: { fontSize: 14, fontWeight: 'bold', color: colors.textSecondary },
    tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    td: { fontSize: 15, color: colors.text },
    emptyText: { textAlign: 'center', color: colors.textSecondary, marginTop: 20, marginBottom: 10 },
    recentOrdersContainer: { marginTop: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: colors.text },
    orderCard: { backgroundColor: colors.surface, padding: 16, borderRadius: radii.medium, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
    orderCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    orderNumber: { fontSize: 16, fontWeight: 'bold' },
    orderTotal: { fontSize: 16, fontWeight: 'bold', color: colors.accent },
    orderDate: { fontSize: 13, color: colors.textSecondary }
});