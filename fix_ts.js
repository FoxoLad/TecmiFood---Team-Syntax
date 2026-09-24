const fs = require('fs');

// 1. Fix orders.tsx (any type)
let ordersCode = fs.readFileSync('src/app/client/orders.tsx', 'utf8');
ordersCode = ordersCode.replace(/const renderItem = \(item, index\) => \(/g, 'const renderItem = (item: any, index: number) => (');
ordersCode = ordersCode.replace(/item\.modifications\.map\(m => /g, 'item.modifications.map((m: any) => ');
fs.writeFileSync('src/app/client/orders.tsx', ordersCode);

// 2. Fix [id].tsx (useUserStore.getState().user?.employeeCafeteria)
let idCode = fs.readFileSync('src/app/employee/orders/[id].tsx', 'utf8');
idCode = idCode.replace(/useUserStore\.getState\(\)\.user\?\.employeeCafeteria/g, 'useUserStore.getState().employeeCafeteria');
fs.writeFileSync('src/app/employee/orders/[id].tsx', idCode);

// 3. Fix index.tsx (Property 'name' does not exist on type 'never')
// Wait, `cafeteriaItems.map((item, index) =>` in index.tsx
let indexCode = fs.readFileSync('src/app/employee/orders/index.tsx', 'utf8');
indexCode = indexCode.replace(/item\.modifications\.map\(m => /g, 'item.modifications.map((m: any) => ');
fs.writeFileSync('src/app/employee/orders/index.tsx', indexCode);
