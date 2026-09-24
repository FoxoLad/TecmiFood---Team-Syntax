const fs = require('fs');
const file = 'src/app/client/(client-tabs)/cart.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /<Text style=\{styles\.orderOnlyButtonText\}>Ordenar solo Busters \| \$\{subtotal\.toFixed\(2\)\}<\/Text>/g,
  '<Text style={styles.orderOnlyButtonText}>Ordenar solo Busters | ${subtotal.toFixed(2)}</Text>'
);
code = code.replace(
  /<Text style=\{styles\.orderOnlyButtonText\}>Ordenar solo Bee Sweet \| \$\{subtotal\.toFixed\(2\)\}<\/Text>/g,
  '<Text style={styles.orderOnlyButtonText}>Ordenar solo Bee Sweet | ${subtotal.toFixed(2)}</Text>'
);

fs.writeFileSync(file, code);
