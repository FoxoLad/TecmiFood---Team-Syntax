const fs = require('fs');
let code = fs.readFileSync('src/app/client/settings.tsx', 'utf8');

const regex = /<View style=\{styles\.divider\} \/>\s*<View style=\{styles\.row\}>\s*<View style=\{styles\.copy\}>\s*<Text style=\{styles\.rowTitle\}>Animación del tema<\/Text>\s*<Text style=\{styles\.rowHint\}>El círculo se abre desde el centro\.<\/Text>\s*<\/View>\s*<Switch\s*accessibilityLabel="Animar el cambio de tema"\s*onValueChange=\{setAnimate\}\s*thumbColor="#FFFFFF"\s*trackColor=\{\{ false: colors\.border, true: colors\.accent \}\}\s*value=\{animate\}\s*\/>\s*<\/View>/;

code = code.replace(regex, '');
fs.writeFileSync('src/app/client/settings.tsx', code);
