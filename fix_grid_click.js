const fs = require('fs');

function fixGrid(file) {
    let code = fs.readFileSync(file, 'utf8');
    code = code.replace(/disabled=\{!product\.inStock\}/g, '');
    fs.writeFileSync(file, code);
}

fixGrid('src/app/client/cafeterias/bustershome.tsx');
fixGrid('src/app/client/cafeterias/beesweethome.tsx');
