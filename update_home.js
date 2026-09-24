const fs = require('fs');
let code = fs.readFileSync('src/app/client/(client-tabs)/home.tsx', 'utf8');
code = code.replace(/accessibilityRole={item\.businessId === "BT" \? "button" : undefined}/g, 'accessibilityRole="button"');
code = code.replace(/disabled={item\.businessId !== "BT"}/g, '');
code = code.replace(/pressed && item\.businessId === "BT" && styles\.productCardPressed/g, 'pressed && styles.productCardPressed');
code = code.replace(/{item\.businessId === "BT" \? \(([\s\S]*?)\) : null}/g, '$1');
fs.writeFileSync('src/app/client/(client-tabs)/home.tsx', code);
console.log('Fixed home.tsx disabled logic');
