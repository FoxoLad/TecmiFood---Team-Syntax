const fs = require('fs');
let code = fs.readFileSync('src/app/employee/inventory.tsx', 'utf8');

code = code.replace(
  /Text,\s*View,/g,
  'Text,\n  View,\n  TextInput,'
);

fs.writeFileSync('src/app/employee/inventory.tsx', code);
