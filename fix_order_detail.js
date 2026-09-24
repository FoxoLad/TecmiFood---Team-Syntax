const fs = require('fs');
const file = 'src/app/employee/orders/[id].tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /\{order\.items\.map\(\(product, idx\) => \(/g,
  `{order.items.filter(item => {
    const isBusters = item.productId.startsWith('BT');
    const isBeeSweet = item.productId.startsWith('BS');
    const isEmployeeBusters = useUserStore.getState().user?.employeeCafeteria === 'Busters';
    return (isBusters && isEmployeeBusters) || (isBeeSweet && !isEmployeeBusters);
  }).map((product, idx) => (`
);

fs.writeFileSync(file, code);
