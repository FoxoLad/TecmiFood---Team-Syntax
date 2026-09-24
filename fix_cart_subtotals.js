const fs = require('fs');
const file = 'src/app/client/(client-tabs)/cart.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /\{bustersItems\.length > 0 && \(/,
  '{bustersItems.length > 0 && (() => {\n          const subtotal = bustersItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);\n          return ('
);
code = code.replace(
  /<Text style=\{styles\.orderOnlyButtonText\}>Ordenar solo Busters<\/Text>/,
  '<Text style={styles.orderOnlyButtonText}>Ordenar solo Busters | ${subtotal.toFixed(2)}</Text>'
);
code = code.replace(
  /<\/Pressable>\n\s*<\/View>\n\s*\)}/,
  '</Pressable>\n          </View>\n        ); })()}'
);

code = code.replace(
  /\{beeSweetItems\.length > 0 && \(/,
  '{beeSweetItems.length > 0 && (() => {\n          const subtotal = beeSweetItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);\n          return ('
);
code = code.replace(
  /<Text style=\{styles\.orderOnlyButtonText\}>Ordenar solo Bee Sweet<\/Text>/,
  '<Text style={styles.orderOnlyButtonText}>Ordenar solo Bee Sweet | ${subtotal.toFixed(2)}</Text>'
);
code = code.replace(
  /<\/Pressable>\n\s*<\/View>\n\s*\)}/,
  '</Pressable>\n          </View>\n        ); })()}'
);

fs.writeFileSync(file, code);
console.log('Cart fixed');
