const fs = require('fs');
let code = fs.readFileSync('src/stores/useOrders.ts', 'utf8');

// Fix deleteOrder type in interface
code = code.replace(
  /deleteOrder: \(orderNumber: string\) => Promise<void>;/,
  'deleteOrder: (orderNumber: string) => Promise<void>;'
); // Ah wait, the interface might not have been updated correctly if my previous regex failed!

if (!code.includes('deleteOrder: (orderNumber: string) => Promise<void>;')) {
    code = code.replace(
      /updateOrderStatus: \(orderNumber: string, status: RealOrder\["status"\]\) => Promise<void>;/,
      'updateOrderStatus: (orderNumber: string, status: RealOrder["status"]) => Promise<void>;\n  deleteOrder: (orderNumber: string) => Promise<void>;'
    );
}

// Fix parameter type in implementation
code = code.replace(
  /deleteOrder: async \(orderNumber\) => \{/,
  'deleteOrder: async (orderNumber: string) => {'
);

fs.writeFileSync('src/stores/useOrders.ts', code);
