const fs = require('fs');
let code = fs.readFileSync('src/app/employee/orders/index.tsx', 'utf8');

const regexFilter = /const isDelivered = order\.status === "Entregado";[\s\S]*?return \(matchesName \|\| matchesOrder \|\| matchesProduct\) && matchesStatus;/;
const replacementFilter = `
    const isDelivered = order.status === "Entregado";
    const isCancelled = order.status === "Cancelado";
    const isArchived = order.status === "Cancelado_Archivado" || order.status === "Cancelado_Oculto";
    if (isArchived) return false;
    
    const isPending = !isDelivered && !isCancelled;
    
    let matchesStatus = false;
    if (selectedFilter === "Todos") matchesStatus = true;
    else if (selectedFilter === "Entregados") matchesStatus = isDelivered;
    else matchesStatus = isPending || isCancelled; // Pendientes shows active + cancelled

    return (matchesName || matchesOrder || matchesProduct) && matchesStatus;`;

code = code.replace(regexFilter, replacementFilter.trim());

// We also need to add updateOrderStatus from useOrders to index.tsx!
code = code.replace(/const confirmReturnToClient = \(\) => \{/, 'const updateOrderStatus = useOrders((state) => state.updateOrderStatus);\n  const confirmReturnToClient = () => {');

// Render the Cancelado overlay and Eliminar button
const regexCard = /<View style=\{\[style\.orderCard, \{ padding: 16 \}\]\}>/;
const replacementCard = `
<View style={[style.orderCard, { padding: 16, opacity: order.status === "Cancelado" ? 0.6 : 1 }]}>
                  {order.status === "Cancelado" && (
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 24 }}>
                       <Text style={{ color: '#CC0A0A', fontSize: 24, fontWeight: 'bold', backgroundColor: '#FFE5E5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, overflow: 'hidden' }}>CANCELADO</Text>
                       <Pressable onPress={(e) => { e.stopPropagation(); updateOrderStatus(order.orderNumber, "Cancelado_Oculto"); }} style={{ marginTop: 16, backgroundColor: '#333', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}>
                          <Text style={{ color: '#FFF', fontWeight: '600' }}>Ocultar</Text>
                       </Pressable>
                    </View>
                  )}
`;

code = code.replace(regexCard, replacementCard.trim());

fs.writeFileSync('src/app/employee/orders/index.tsx', code);
