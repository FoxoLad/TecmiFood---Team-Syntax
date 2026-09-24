const fs = require('fs');
let code = fs.readFileSync('src/app/employee/orders/index.tsx', 'utf8');

const regex = /const isOpen = useCafeteriaStatus\(\(state\) => state\.isOpen\);\n\s*const opensAt = useCafeteriaStatus\(\(state\) => state\.opensAt\);\n\s*const closesAt = useCafeteriaStatus\(\(state\) => state\.closesAt\);/;
const replacement = `
  const employeeCafeteria = useUserStore((state) => state.employeeCafeteria);
  const cafeteriaKey = employeeCafeteria === "Busters" ? "busters" : "beesweet";
  const status = useCafeteriaStatus((state) => state[cafeteriaKey]);
  const isOpen = status.isOpen;
  const opensAt = status.opensAt;
  const closesAt = status.closesAt;`;
code = code.replace(regex, replacement.trim());

// Second occurrence of employeeCafeteria
code = code.replace(/const employeeCafeteria = useUserStore\(\(state\) => state\.employeeCafeteria\);\n/, '');

// Fix setHours and setOpen usages
code = code.replace(/setHours\(hourDraft\.opensAt, hourDraft\.closesAt\);/g, 'setHours(cafeteriaKey, hourDraft.opensAt, hourDraft.closesAt);');
code = code.replace(/onValueChange=\{setOpen\}/g, 'onValueChange={(val) => setOpen(cafeteriaKey, val)}');

fs.writeFileSync('src/app/employee/orders/index.tsx', code);
