const fs = require('fs');
let code = fs.readFileSync('src/stores/useProduct.ts', 'utf8');
code = code.replace(/fetch\(endpoints\.products\)/, 'fetch(endpoints.products + "?admin=true")');
fs.writeFileSync('src/stores/useProduct.ts', code);
