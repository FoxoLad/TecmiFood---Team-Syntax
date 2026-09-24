const fs = require('fs');
let code = fs.readFileSync('src/app/employee/orders/index.tsx', 'utf8');

code = code.replace(
  /const isOpen = useCafeteriaStatus\(\(state\) => state\.isOpen\);\n\s*const opensAt = useCafeteriaStatus\(\(state\) => state\.opensAt\);\n\s*const closesAt = useCafeteriaStatus\(\(state\) => state\.closesAt\);/,
  `const employeeCafeteria = useUserStore((state) => state.employeeCafeteria);
  const cafeteriaKey = employeeCafeteria === "Busters" ? "busters" : "beesweet";
  const status = useCafeteriaStatus((state) => state[cafeteriaKey]);
  const isOpen = status.isOpen;
  const opensAt = status.opensAt;
  const closesAt = status.closesAt;`
);

fs.writeFileSync('src/app/employee/orders/index.tsx', code);
