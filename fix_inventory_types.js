const fs = require('fs');
let code = fs.readFileSync('src/app/employee/inventory.tsx', 'utf8');

code = code.replace(
  /pathname: "\/employee\/product-form"/g,
  'pathname: "/employee/product-form" as any'
);

code = code.replace(
  /router\.push\("\/employee\/product-form"\)/g,
  'router.push("/employee/product-form" as any)'
);

fs.writeFileSync('src/app/employee/inventory.tsx', code);
