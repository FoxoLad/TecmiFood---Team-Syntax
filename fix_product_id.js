const fs = require('fs');

function replaceSafe(file, from, to) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(from, to);
    fs.writeFileSync(file, content);
  }
}

replaceSafe('src/app/client/orders.tsx', /item\.productId\.startsWith\(/g, 'item.productId?.startsWith(');
replaceSafe('src/app/employee/orders/[id].tsx', /item\.productId\.startsWith\(/g, 'item.productId?.startsWith(');
replaceSafe('src/app/employee/orders/index.tsx', /item\.productId\.startsWith\(/g, 'item.productId?.startsWith(');
replaceSafe('src/app/employee/history.tsx', /item\.productId\.startsWith\(/g, 'item.productId?.startsWith(');

console.log('Fixed productId safety');
