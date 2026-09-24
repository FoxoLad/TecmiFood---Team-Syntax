const fs = require('fs');
let code = fs.readFileSync('src/app/employee/orders/index.tsx', 'utf8');

const regexVars = /const isOpen = useCafeteriaStatus[\s\S]*?sourceClose: closesAt,\n  \}\);/;
const replacementVars = `
  const employeeCafeteria = useUserStore((state) => state.employeeCafeteria);
  const cafeteriaKey = employeeCafeteria === "Busters" ? "busters" : "beesweet";
  const status = useCafeteriaStatus((state) => state[cafeteriaKey]);
  
  const isOpen = status.isOpen;
  const opensAt = status.opensAt;
  const closesAt = status.closesAt;
  const setOpen = useCafeteriaStatus((state) => state.setOpen);
  const setHours = useCafeteriaStatus((state) => state.setHours);
  const fetchStatus = useCafeteriaStatus((state) => state.fetchStatus);
  const [hourDraft, setHourDraft] = useState({
    opensAt,
    closesAt,
    sourceOpen: opensAt,
    sourceClose: closesAt,
  });
`;
code = code.replace(regexVars, replacementVars.trim());

// Also remove `const employeeCafeteria = ...` from further down if it exists, to avoid redeclaration.
code = code.replace(/const employeeCafeteria = useUserStore\(\(state\) => state\.employeeCafeteria\);\n/, '');

const regexSaveHours = /setHours\(hourDraft\.opensAt, hourDraft\.closesAt\);/;
code = code.replace(regexSaveHours, 'setHours(cafeteriaKey, hourDraft.opensAt, hourDraft.closesAt);');

const regexSetOpen = /setOpen\}/; // the switch onValueChange={setOpen}
code = code.replace(/onValueChange=\{setOpen\}/, 'onValueChange={(val) => setOpen(cafeteriaKey, val)}');

fs.writeFileSync('src/app/employee/orders/index.tsx', code);
