const fs = require('fs');
let code = fs.readFileSync('src/app/employee/history.tsx', 'utf8');

// Change "Meses" to "Histórico"
code = code.replace(/'Meses'/g, "'Histórico'");
code = code.replace(/"Meses"/g, '"Histórico"');

// Fix Back Label
// title={`Ventas - ${formatMonth(selectedMonth)}`}
// backLabel="Órdenes"
code = code.replace(
  /backLabel="Órdenes"/,
  'backLabel={period === "Histórico" && selectedMonth ? "Histórico" : "Órdenes"}'
);

fs.writeFileSync('src/app/employee/history.tsx', code);
