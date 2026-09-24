const fs = require('fs');
const file = 'src/app/employee/history.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/<Text style=\{styles\.orderTotal\}>\$\{order\.totalAmount\.toFixed\(2\)\}<\/Text>/g, `{(() => {
  const prefix = employeeCafeteria === 'Busters' ? 'BT' : 'BS';
  const cafeteriaTotal = order.items.filter(item => item.productId.startsWith(prefix)).reduce((acc, i) => acc + i.price * i.quantity, 0);
  return <Text style={styles.orderTotal}>\${cafeteriaTotal.toFixed(2)}</Text>;
})()}`);

// Also fix stats logic which might be using order.totalAmount
// Let's check how revenue is calculated.
code = code.replace(/let revenue = 0;/g, 'let revenue = 0; const prefix = employeeCafeteria === "Busters" ? "BT" : "BS";');
code = code.replace(/revenue \+= order\.totalAmount;/g, 'revenue += order.items.filter(item => item.productId.startsWith(prefix)).reduce((acc, i) => acc + i.price * i.quantity, 0);');

fs.writeFileSync(file, code);
