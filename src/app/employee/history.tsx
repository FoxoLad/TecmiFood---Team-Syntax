/** Resumen de ventas del empleado a partir de los pedidos ya entregados. */
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmployeeHeader } from '../../components/EmployeeHeader';
import { colors, employee, radii } from '../../constants/theme';
import { useOrders } from '../../stores/useOrders';
import { formatOrderNumber } from '../../types/order';

import { useUserStore } from '../../stores/useUserStore';

type Period = 'Hoy' | 'Semana' | 'Mes' | 'Histórico';

export default function EmployeeHistoryScreen() {
    const orders = useOrders((state) => state.orders);
    const employeeCafeteria = useUserStore((state) => state.employeeCafeteria);
    const [period, setPeriod] = useState<Period>('Hoy');
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

    const { products, grandTotal, count, periodOrders, availableMonths } = useMemo(() => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfDay);
        const dayOfWeek = startOfDay.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startOfWeek.setDate(startOfDay.getDate() - diff);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const deliveredOrders = orders.filter(o => o.status === 'Entregado').filter((order) => {
            if (employeeCafeteria === "Busters") {
              return order.items.some(item => item.productId?.startsWith("BT"));
            } else if (employeeCafeteria === "Bee Sweet") {
              return order.items.some(item => item.productId?.startsWith("BS"));
            }
            return true;
        });

        const monthsSet = new Set<string>();
        deliveredOrders.forEach(o => {
           monthsSet.add(new Date(o.createdAt).toISOString().substring(0, 7));
        });
        const availableMonths = Array.from(monthsSet).sort().reverse();

        const periodOrders = deliveredOrders.filter(order => {
            const orderDate = new Date(order.createdAt);
            switch (period) {
                case 'Hoy': return orderDate >= startOfDay;
                case 'Semana': return orderDate >= startOfWeek;
                case 'Mes': return orderDate >= startOfMonth;
                case 'Histórico': 
                    if (selectedMonth) {
                        return orderDate.toISOString().substring(0, 7) === selectedMonth;
                    }
                    return false;
                default: return true;
            }
        });

        const productMap: Record<string, { qty: number; price: number; total: number }> = {};
        let grandTotal = 0;

        periodOrders.forEach(order => {
            order.items.forEach(item => {
                const prefix = employeeCafeteria === 'Busters' ? 'BT' : 'BS';
                if (!item.productId?.startsWith(prefix)) return;
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

        return { products, grandTotal, count: periodOrders.length, periodOrders, availableMonths };
    }, [orders, period, selectedMonth, employeeCafeteria]);

    const formatMonth = (m: string) => {
        const [y, mth] = m.split('-');
        const date = new Date(parseInt(y), parseInt(mth) - 1, 1);
        return date.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();
    };

    return (
        <View style={styles.shell}>
            <SafeAreaView edges={['top']} style={styles.shellTop}>
                <EmployeeHeader backLabel={period === "Histórico" && selectedMonth ? "Histórico" : "Órdenes"} onBack={() => {
                    if (period === 'Histórico' && selectedMonth) {
                        setSelectedMonth(null);
                    } else {
                        router.back();
                    }
                }} title={period === 'Histórico' && selectedMonth ? `Ventas - ${formatMonth(selectedMonth)}` : `Ventas - ${employeeCafeteria || "General"}`} />
            </SafeAreaView>
            <SafeAreaView edges={['bottom']} style={styles.container}>

            <View style={styles.tabsContainer}>
                {(['Hoy', 'Semana', 'Mes', 'Histórico'] as Period[]).map((p) => (
                    <Pressable
                        key={p}
                        style={[styles.tab, period === p && styles.activeTab]}
                        onPress={() => { setPeriod(p as Period); if (p !== 'Histórico') setSelectedMonth(null); }}
                    >
                        <Text style={[styles.tabText, period === p && styles.activeTabText]}>{p}</Text>
                    </Pressable>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {period === 'Histórico' && !selectedMonth ? (
                    <View style={styles.monthsList}>
                        <Text style={styles.monthsTitle}>Selecciona un mes</Text>
                        {availableMonths.length === 0 ? (
                            <Text style={styles.emptyText}>No hay historial de ventas anterior.</Text>
                        ) : (
                            availableMonths.map(m => (
                                <Pressable key={m} style={styles.monthCard} onPress={() => setSelectedMonth(m)}>
                                    <Text style={styles.monthText}>{formatMonth(m)}</Text>
                                </Pressable>
                            ))
                        )}
                    </View>
                ) : (
                <>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Total Vendido ({period === 'Histórico' ? formatMonth(selectedMonth!) : period})</Text>
                    <Text style={styles.summaryTotal}>${grandTotal.toFixed(2)}</Text>
                    <Text style={styles.summaryOrders}>{count} pedidos entregados</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.th, { flex: 2 }]}>Producto</Text>
                        <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>Cant.</Text>
                        <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Total</Text>
                    </View>
                    
                    {products.length === 0 ? (
                        <Text style={styles.emptyText}>No hay ventas en este periodo.</Text>
                    ) : (
                        products.map((p, idx) => (
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
                    <Text style={styles.recentOrdersTitle}>Pedidos de {period === 'Histórico' ? formatMonth(selectedMonth!) : period}</Text>
                    {periodOrders.length === 0 ? (
                        <Text style={styles.emptyOrdersText}>Ningún pedido para mostrar.</Text>
                    ) : (
                        periodOrders.map(order => (
                            <Pressable 
                                key={order.orderNumber} 
                                style={styles.recentOrderCard}
                                onPress={() => router.push({
                                    pathname: '/employee/orders/[id]',
                                    params: { id: order.orderNumber }
                                })}
                            >
                                <View style={styles.recentOrderHeader}>
                                    <Text style={styles.recentOrderNumber}>#{formatOrderNumber(order.orderNumber)}</Text>
                                    <Text style={styles.recentOrderDate}>
                                        {new Date(order.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                    </Text>
                                </View>
                                <Text style={styles.recentOrderCustomer}>{order.customerName}</Text>
                            </Pressable>
                        ))
                    )}
                </View>
                </>
                )}
            </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    shell: { backgroundColor: employee.background, flex: 1 },
    shellTop: { backgroundColor: employee.background },
    container: {
        backgroundColor: '#FAFAFA',
        borderTopLeftRadius: radii.large,
        borderTopRightRadius: radii.large,
        flex: 1,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: employee.accent,
    },
    tabText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    activeTabText: {
        color: employee.accent,
        fontWeight: 'bold',
    },
    content: {
        padding: 16,
    },
    summaryCard: {
        backgroundColor: employee.accent,
        borderRadius: radii.medium,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
    },
    summaryLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 8,
    },
    summaryTotal: {
        color: '#FFFFFF',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    summaryOrders: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    table: {
        backgroundColor: '#FFFFFF',
        borderRadius: radii.medium,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.border,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: 12,
        marginBottom: 12,
    },
    th: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    td: {
        fontSize: 14,
        color: colors.text,
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textSecondary,
        paddingVertical: 24,
    },
    recentOrdersContainer: {
        marginTop: 8,
    },
    recentOrdersTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    recentOrderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: radii.medium,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    recentOrderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    recentOrderNumber: {
        fontWeight: 'bold',
        fontSize: 16,
        color: colors.text,
    },
    recentOrderDate: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    recentOrderCustomer: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    emptyOrdersText: {
        textAlign: 'center',
        color: colors.textSecondary,
        marginTop: 16,
    },
    monthsList: {
        marginTop: 16,
    },
    monthsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: colors.text,
    },
    monthCard: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    monthText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: employee.accent,
    },
});