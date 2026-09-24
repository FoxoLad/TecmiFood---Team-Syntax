const fs = require('fs');
let code = fs.readFileSync('src/app/employee/inventory.tsx', 'utf8');

if (!code.includes('TextInput')) {
    code = code.replace(/Text, View/g, 'Text, View, TextInput');
} else if (!code.match(/import\s+\{.*?TextInput.*?\}\s+from\s+['"]react-native['"]/)) {
    code = code.replace(/Text, View/g, 'Text, View, TextInput');
}

fs.writeFileSync('src/app/employee/inventory.tsx', code);
