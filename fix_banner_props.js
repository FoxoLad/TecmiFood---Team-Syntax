const fs = require('fs');

function replaceBanner(file, key) {
    let code = fs.readFileSync(file, 'utf8');
    code = code.replace(/<CafeteriaStatusBanner \/>/g, `<CafeteriaStatusBanner cafeteriaKey="${key}" />`);
    fs.writeFileSync(file, code);
}

replaceBanner('src/app/client/cafeterias/bustershome.tsx', 'busters');
replaceBanner('src/app/client/cafeterias/beesweethome.tsx', 'beesweet');
