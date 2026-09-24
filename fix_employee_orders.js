const fs = require('fs');
const file = 'src/app/employee/orders/index.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /filteredOrders\.map\(\(order\) => \{([\s\S]*?)return \([\s\S]*?<View style=\{style\.itemsList\}>([\s\S]*?)<\/View>[\s\S]*?<View style=\{style\.totalRow\}>([\s\S]*?)<\/View>[\s\S]*?<\/Pressable>/;

code = code.replace(regex, (match, beforeReturn, itemsList, totalRow) => {
  // We want to filter order.items based on employeeCafeteria
  return `filteredOrders.map((order) => {
            const prefix = employeeCafeteria === 'Busters' ? 'BT' : 'BS';
            const cafeteriaItems = order.items.filter(item => item.productId.startsWith(prefix));
            const cafeteriaTotal = cafeteriaItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
            
            const status = statusStyles[order.status] || { backgroundColor: "#ccc", color: "#000", label: order.status };

            return (
              <Pressable
                key={order._id || order.orderNumber}
                onPress={() => router.push(\`/employee/orders/\${order.orderNumber}\`)}
              >
                <View style={[style.orderCard, { padding: 16 }]}>
                  <View style={[style.orderHeader, { borderBottomWidth: 0, paddingHorizontal: 0, paddingVertical: 0 }]}>
                    <Text style={style.orderNumber} numberOfLines={1} ellipsizeMode="tail">
                      #{formatOrderNumber(order.orderNumber)} - {order.customerName}
                    </Text>
                    <View style={[style.statusPill, { backgroundColor: status.backgroundColor }]}>
                      <Text style={[style.statusText, { color: status.color }]}>{status.label}</Text>
                    </View>
                  </View>
                  <Text style={style.orderDate}>
                    {new Date(order.createdAt).toLocaleString("es-MX")}
                  </Text>

                  <View style={style.itemsList}>
                    {cafeteriaItems.map((item, index) => (
                      <View key={\`\${item.productId}-\${index}\`} style={style.itemRow}>
                        <ProductImage
                          contentFit="cover"
                          image={item.image}
                          name={item.name}
                          style={style.itemImage}
                        />
                        <Text style={style.itemQuantity}>{item.quantity}×</Text>
                        <View style={{ flex: 1, paddingRight: 8 }}>
                          <Text numberOfLines={2} style={style.itemName}>
                            {item.name}
                          </Text>
                          {item.modifications && item.modifications.length > 0 && (
                            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                              Mods: {item.modifications.map(m => typeof m === 'string' ? m : m.name).join(", ")}
                            </Text>
                          )}
                          {item.notes ? (
                            <Text style={{ fontSize: 12, color: colors.textSecondary, fontStyle: "italic", marginTop: 2 }}>
                              Nota: {item.notes}
                            </Text>
                          ) : null}
                        </View>
                        <Text style={style.itemPrice}>
                          \${(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={style.totalRow}>
                    <Text style={style.totalLabel}>Total</Text>
                    <Text style={style.totalValue}>\${cafeteriaTotal.toFixed(2)}</Text>
                  </View>
                </View>
              </Pressable>`;
});

fs.writeFileSync(file, code);
console.log('Employee UI filtered by cafeteria items');
