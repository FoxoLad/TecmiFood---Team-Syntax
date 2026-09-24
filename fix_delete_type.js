const fs = require('fs');
let code = fs.readFileSync('src/stores/useOrders.ts', 'utf8');

code = code.replace(
  /deleteOrder: \(orderNumber: string\)/g,
  'deleteOrder: (orderNumber: number)'
);

code = code.replace(
  /deleteOrder: async \(orderNumber: string\)/g,
  'deleteOrder: async (orderNumber: number)'
);

fs.writeFileSync('src/stores/useOrders.ts', code);
