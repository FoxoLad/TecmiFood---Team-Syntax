const fs = require('fs');
let code = fs.readFileSync('src/app/client/orders.tsx', 'utf8');

// Add updateOrderStatus
code = code.replace(/const fetchOrders = useOrders\(\(state\) => state\.fetchOrders\);/, 'const fetchOrders = useOrders((state) => state.fetchOrders);\n  const updateOrderStatus = useOrders((state) => state.updateOrderStatus);');

// Add handleCancel inside ClientOrdersScreen
const handleCancelFunc = `
  const handleCancel = (order: RealOrder) => {
    Alert.alert(
      "Cancelar pedido",
      "¿Estás seguro de que deseas cancelar este pedido?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Sí, cancelar", 
          style: "destructive", 
          onPress: async () => {
             await updateOrderStatus(order.orderNumber, "Cancelado");
             fetchOrders();
          }
        }
      ]
    );
  };
`;
code = code.replace(/const handleReorder = /, handleCancelFunc + '\n  const handleReorder = ');

// Add the Cancel button inside the renderItem
const cancelButtonStr = `
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>\${order.totalAmount.toFixed(2)}</Text>
                </View>
                {view === "active" && (order.status === "Nuevo pedido" || order.status === "Pendiente") && (
                   <Pressable onPress={() => handleCancel(order)} style={{ marginTop: 12, backgroundColor: '#FFE5E5', padding: 12, borderRadius: 8, alignItems: 'center' }}>
                       <Text style={{ color: '#CC0A0A', fontWeight: 'bold' }}>Cancelar pedido</Text>
                   </Pressable>
                )}
`;

code = code.replace(/<View style=\{styles\.totalRow\}>[\s\S]*?<\/View>/, cancelButtonStr.trim());

fs.writeFileSync('src/app/client/orders.tsx', code);
