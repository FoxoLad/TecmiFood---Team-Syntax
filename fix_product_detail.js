const fs = require('fs');
let code = fs.readFileSync('src/app/client/cafeterias/product/[id].tsx', 'utf8');

// Render AGOTADO tag
const regexName = /<Text style=\{styles\.name\}>\{product\.name\}<\/Text>/;
const replacementName = `<Text style={styles.name}>{product.name}</Text>
                {!product.inStock && (
                    <Text style={{ color: '#CC0A0A', fontWeight: 'bold', fontSize: 16, marginBottom: 8, backgroundColor: '#FFE5E5', padding: 8, borderRadius: 8, textAlign: 'center', overflow: 'hidden' }}>PRODUCTO AGOTADO</Text>
                )}`;
code = code.replace(regexName, replacementName);

// Update button disabled state
const regexBtn = /accessibilityLabel=\{isOpen \? `Agregar \$\{product\.name\} al carrito` : "La cafetería está cerrada"\}\s*disabled=\{!isOpen\}\s*onPress=\{orderProduct\}\s*style=\{\[styles\.orderButton, !isOpen && styles\.orderButtonDisabled\]\}/;
const replacementBtn = `accessibilityLabel={!product.inStock ? "Producto agotado" : (isOpen ? \`Agregar \${product.name} al carrito\` : "La cafetería está cerrada")}
                    disabled={!isOpen || !product.inStock}
                    onPress={orderProduct}
                    style={[styles.orderButton, (!isOpen || !product.inStock) && styles.orderButtonDisabled]}`;
code = code.replace(regexBtn, replacementBtn);

fs.writeFileSync('src/app/client/cafeterias/product/[id].tsx', code);
