const fs = require('fs');
let code = fs.readFileSync('src/app/client/(client-tabs)/cart.tsx', 'utf8');

code = code.replace(
  /const bustersItems = items\.filter\(i => i\.product\.businessId === "BT"\);\n  const beeSweetItems = items\.filter\(i => i\.product\.businessId === "BS"\);/,
  `const bustersItems = items.filter(i => i.product.businessId === "BT");
  const beeSweetItems = items.filter(i => i.product.businessId === "BS");
  const canOrderAll = (bustersItems.length === 0 || bustersState.isOpen) && (beeSweetItems.length === 0 || beesweetState.isOpen);`
);

code = code.replace(/\{!isOpen \?/g, '{!canOrderAll ?');
code = code.replace(/!isOpen/g, '!canOrderAll');
code = code.replace(/\{isOpen \? "CONFIRMAR PEDIDO" : "CAFETERÍA CERRADA"\}/g, '{canOrderAll ? "CONFIRMAR PEDIDO" : "CAFETERÍA CERRADA"}');

fs.writeFileSync('src/app/client/(client-tabs)/cart.tsx', code);
