const fs = require('fs');
const file = 'src/app/client/(client-tabs)/cart.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/const sendOrder = async \(orderItems\) => \{/, 'const sendOrder = async (orderItems: typeof items) => {');
code = code.replace(/\(sum, item\) => sum \+ item\.product\.price \* item\.quantity/g, '(sum: number, item: any) => sum + item.product.price * item.quantity');
code = code.replace(/items: orderItems\.map\(\(item\) => \(\{/g, 'items: orderItems.map((item: any) => ({');
code = code.replace(/\} catch \(err\) \{/g, '} catch (err: any) {');

fs.writeFileSync(file, code);
