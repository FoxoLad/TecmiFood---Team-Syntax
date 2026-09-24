const fs = require('fs');
let code = fs.readFileSync('src/app/employee/orders/index.tsx', 'utf8');

code = code.replace(
  /const updateOrderStatus = useOrders\(\(state\) => state\.updateOrderStatus\);/,
  'const updateOrderStatus = useOrders((state) => state.updateOrderStatus);\n  const deleteOrder = useOrders((state) => state.deleteOrder);'
);

code = code.replace(
  /updateOrderStatus\(order\.orderNumber, "Cancelado_Oculto"\);/,
  'deleteOrder(order.orderNumber);'
);

code = code.replace(
  /<Text style=\{\{ color: '#FFF', fontWeight: '600' \}\}>Ocultar<\/Text>/,
  '<Text style={{ color: "#FFF", fontWeight: "600" }}>Eliminar</Text>'
);

fs.writeFileSync('src/app/employee/orders/index.tsx', code);
