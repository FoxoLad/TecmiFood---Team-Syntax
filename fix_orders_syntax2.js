const fs = require('fs');
const file = 'src/app/client/orders.tsx';
let code = fs.readFileSync(file, 'utf8');

// The problematic string starts after `})()}` and goes until `<View style={styles.totalRow}>`
// Wait, the first `</View>` after `})()}` is the end of `itemsList`.
// So we should replace `})()}` until `styles.totalRow` with `})()} </View> <View style={styles.totalRow}>`

code = code.replace(/\}\)\(\)\}\s*<\/View>[\s\S]*?<View style=\{styles\.totalRow\}>/, '})()}\n                </View>\n\n                <View style={styles.totalRow}>');

fs.writeFileSync(file, code);
