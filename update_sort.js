const fs = require('fs');

const files = ['src/app/client/cafeterias/bustershome.tsx', 'src/app/client/cafeterias/beesweethome.tsx'];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/if \(lower\.includes\('frío'\) \|\| lower\.includes\('frio'\)\) return 1;/g, "if (lower.includes('frí') || lower.includes('fri') || lower.includes('fria')) return 1;");
  fs.writeFileSync(file, code);
});
console.log('Fixed sorting logic');
