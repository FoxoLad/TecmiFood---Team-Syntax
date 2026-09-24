const fs = require('fs');
let code = fs.readFileSync('src/app/client/cafeterias/product/[id].tsx', 'utf8');

code = code.replace(
  /const isOpen = useCafeteriaStatus\(\(state\) => state\.isOpen\);/,
  'const busters = useCafeteriaStatus((state) => state.busters);\n    const beesweet = useCafeteriaStatus((state) => state.beesweet);'
);

code = code.replace(
  /const product = useMemo\([\s\S]*?\);/,
  `const product = useMemo(
        () => products.find((currentProduct) => currentProduct.id === productId),
        [productId, products],
    );
    const isOpen = product ? (product.businessId === "BS" ? beesweet.isOpen : busters.isOpen) : false;`
);

fs.writeFileSync('src/app/client/cafeterias/product/[id].tsx', code);
