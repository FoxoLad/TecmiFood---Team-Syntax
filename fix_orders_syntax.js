const fs = require('fs');
const file = 'src/app/client/orders.tsx';
let code = fs.readFileSync(file, 'utf8');

// The problematic leftover code:
const problemStr = `                      <Text style={styles.itemPrice}>
                        \${(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>`;

code = code.replace(problemStr, '');

fs.writeFileSync(file, code);
