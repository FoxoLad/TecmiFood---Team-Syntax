const fs = require('fs');
const file = 'src/app/employee/history.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /order\.items\.forEach\(item => \{/;
code = code.replace(regex, `order.items.forEach(item => {
                const prefix = employeeCafeteria === 'Busters' ? 'BT' : 'BS';
                if (!item.productId.startsWith(prefix)) return;`);

fs.writeFileSync(file, code);
