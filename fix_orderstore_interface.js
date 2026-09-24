const fs = require('fs');
let code = fs.readFileSync('src/stores/useOrders.ts', 'utf8');

code = code.replace(
  /updateOrderStatus: \(orderNumber: number, status: string\) => Promise<void>;/,
  'updateOrderStatus: (orderNumber: number, status: string) => Promise<void>;\n  deleteOrder: (orderNumber: number) => Promise<void>;'
);

fs.writeFileSync('src/stores/useOrders.ts', code);
