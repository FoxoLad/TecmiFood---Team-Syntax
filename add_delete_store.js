const fs = require('fs');
let code = fs.readFileSync('src/stores/useOrders.ts', 'utf8');

code = code.replace(
  /updateOrderStatus: \(orderNumber: string, status: RealOrder\["status"\]\) => Promise<void>;/,
  'updateOrderStatus: (orderNumber: string, status: RealOrder["status"]) => Promise<void>;\n  deleteOrder: (orderNumber: string) => Promise<void>;'
);

const deleteMethod = `
  deleteOrder: async (orderNumber) => {
    const previous = get().orders;
    set({ orders: previous.filter(o => o.orderNumber !== orderNumber) });
    try {
      const res = await fetch(\`\${endpoints.orders}/\${orderNumber}\`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("No se pudo eliminar en la nube");
    } catch (error) {
      console.error(error);
      set({ orders: previous });
    }
  },
`;

code = code.replace(/updateOrderStatus: async \(orderNumber, status\) => \{/, deleteMethod + '  updateOrderStatus: async (orderNumber, status) => {');

fs.writeFileSync('src/stores/useOrders.ts', code);
