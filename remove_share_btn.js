const fs = require('fs');
let code = fs.readFileSync('src/app/client/cafeterias/product/[id].tsx', 'utf8');

const regex = /<Pressable\s*accessibilityLabel="Compartir producto"[\s\S]*?<\/Pressable>/;
code = code.replace(regex, '');

fs.writeFileSync('src/app/client/cafeterias/product/[id].tsx', code);
