const fs = require('fs');
let code = fs.readFileSync('src/app/employee/history.tsx', 'utf8');

code = code.replace(/\\\`/g, '`');
code = code.replace(/\\\$/g, '$');

fs.writeFileSync('src/app/employee/history.tsx', code);
