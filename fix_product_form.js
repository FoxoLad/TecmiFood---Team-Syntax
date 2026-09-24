const fs = require('fs');
let code = fs.readFileSync('src/app/employee/product-form.tsx', 'utf8');

code = code.replace(/\\\`/g, '`');
code = code.replace(/\\\$/g, '$');

fs.writeFileSync('src/app/employee/product-form.tsx', code);
