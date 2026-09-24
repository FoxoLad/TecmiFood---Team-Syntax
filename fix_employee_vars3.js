const fs = require('fs');
let code = fs.readFileSync('src/app/employee/orders/index.tsx', 'utf8');

const regex = /const isOpen = useCafeteriaStatus\([\s\S]*?const setOpen = useCafeteriaStatus/g;
const replacement = `
  const employeeCafeteria = useUserStore((state) => state.employeeCafeteria);
  const cafeteriaKey = employeeCafeteria === "Busters" ? "busters" : "beesweet";
  const status = useCafeteriaStatus((state) => state[cafeteriaKey]);
  const isOpen = status.isOpen;
  const opensAt = status.opensAt;
  const closesAt = status.closesAt;
  const setOpen = useCafeteriaStatus`;

code = code.replace(regex, replacement.trim());

// We also need to fix `status.isOpen` where `isOpen` was used as a string somewhere in JSX.
// Wait, `isOpen` is a boolean in JSX. But why did I get `Property 'isOpen' does not exist on type 'string'`?
// Let's check `code` for `status.isOpen` to see if I made `status` a string somewhere.
code = code.replace(/\{isOpen\}/g, '{status.isOpen}');
code = code.replace(/isOpen \?/g, 'status.isOpen ?');
code = code.replace(/!isOpen/g, '!status.isOpen');

// Also setHours(cafeteriaKey
code = code.replace(/setHours\(hourDraft\.opensAt, hourDraft\.closesAt\);/g, 'setHours(cafeteriaKey, hourDraft.opensAt, hourDraft.closesAt);');
code = code.replace(/onValueChange=\{setOpen\}/g, 'onValueChange={(val) => setOpen(cafeteriaKey, val)}');

fs.writeFileSync('src/app/employee/orders/index.tsx', code);
