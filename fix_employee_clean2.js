const fs = require('fs');
let code = fs.readFileSync('src/app/employee/orders/index.tsx', 'utf8');

const target = \`  const isOpen = useCafeteriaStatus((state) => state.isOpen);
  const opensAt = useCafeteriaStatus((state) => state.opensAt);
  const closesAt = useCafeteriaStatus((state) => state.closesAt);\`;

const replacement = \`  const employeeCafeteria = useUserStore((state) => state.employeeCafeteria);
  const cafeteriaKey = employeeCafeteria === "Busters" ? "busters" : "beesweet";
  const status = useCafeteriaStatus((state) => state[cafeteriaKey]);
  const isOpen = status.isOpen;
  const opensAt = status.opensAt;
  const closesAt = status.closesAt;\`;

code = code.replace(target, replacement);
code = code.replace(/const employeeCafeteria = useUserStore\(\(state\) => state\.employeeCafeteria\);\n/g, '');

code = code.replace(/setHours\(hourDraft\.opensAt, hourDraft\.closesAt\);/g, 'setHours(cafeteriaKey, hourDraft.opensAt, hourDraft.closesAt);');
code = code.replace(/onValueChange=\{setOpen\}/g, 'onValueChange={(val) => setOpen(cafeteriaKey, val)}');

fs.writeFileSync('src/app/employee/orders/index.tsx', code);
