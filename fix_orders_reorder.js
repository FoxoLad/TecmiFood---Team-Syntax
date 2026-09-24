const fs = require('fs');
let code = fs.readFileSync('src/app/client/orders.tsx', 'utf8');

const regex = /if \(!useCafeteriaStatus\.getState\(\)\.isOpen\) \{[\s\S]*?return;\s*\}/;
const replacement = `
    const state = useCafeteriaStatus.getState();
    const hasBusters = order.items.some(i => i.productId?.startsWith("BT"));
    const hasBeeSweet = order.items.some(i => i.productId?.startsWith("BS"));
    if ((hasBusters && !state.busters.isOpen) || (hasBeeSweet && !state.beesweet.isOpen)) {
      Alert.alert("Cafetería cerrada", "Alguna de las cafeterías de este pedido se encuentra cerrada actualmente.");
      return;
    }`;

code = code.replace(regex, replacement.trim());
fs.writeFileSync('src/app/client/orders.tsx', code);
