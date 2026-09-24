const fs = require('fs');
let code = fs.readFileSync('src/app/client/cafeterias/product/[id].tsx', 'utf8');

code = code.replace(
  /if \(!useCafeteriaStatus\.getState\(\)\.isOpen\) \{/,
  'if (!isOpen) {'
);

fs.writeFileSync('src/app/client/cafeterias/product/[id].tsx', code);
