const fs = require('fs');
const file = 'src/app/client/orders.tsx';
let code = fs.readFileSync(file, 'utf8');

const replacement = `
                <View style={styles.itemsList}>
                  {(() => {
                    const bustersItems = order.items.filter(item => item.productId.startsWith('BT'));
                    const beeSweetItems = order.items.filter(item => item.productId.startsWith('BS'));
                    
                    const renderItem = (item, index) => (
                      <View key={\`\${item.productId}-\${index}\`} style={styles.itemRow}>
                        <ProductImage
                          contentFit="cover"
                          image={item.image}
                          name={item.name}
                          style={styles.itemImage}
                        />
                        <Text style={styles.itemQuantity}>{item.quantity}×</Text>
                        <View style={{ flex: 1, paddingRight: 8 }}>
                          <Text numberOfLines={2} style={styles.itemName}>
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
                        <Text style={styles.itemPrice}>
                          \${(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </View>
                    );

                    return (
                      <>
                        {bustersItems.length > 0 && (
                          <View style={{ marginBottom: 12 }}>
                            {beeSweetItems.length > 0 && (
                              <Text style={{ fontWeight: 'bold', color: colors.accent, marginBottom: 8, fontSize: 12, letterSpacing: 1 }}>BUSTERS (\${bustersItems.reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2)})</Text>
                            )}
                            {bustersItems.map(renderItem)}
                          </View>
                        )}
                        {beeSweetItems.length > 0 && (
                          <View>
                            {bustersItems.length > 0 && (
                              <Text style={{ fontWeight: 'bold', color: colors.accent, marginBottom: 8, fontSize: 12, letterSpacing: 1, marginTop: 4 }}>BEE SWEET (\${beeSweetItems.reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2)})</Text>
                            )}
                            {beeSweetItems.map(renderItem)}
                          </View>
                        )}
                      </>
                    );
                  })()}
                </View>
`;

code = code.replace(
  /<View style=\{styles\.itemsList\}>[\s\S]*?<\/View>/,
  replacement.trim()
);

fs.writeFileSync(file, code);
