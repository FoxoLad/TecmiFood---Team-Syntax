const fs = require('fs');
let code = fs.readFileSync('src/app/employee/orders/index.tsx', 'utf8');

const regex = /const isOpen = useCafeteriaStatus[\s\S]*?sourceClose: closesAt,\n\s*\}\);\n\s*\}/;

const replacement = `
  const employeeCafeteria = useUserStore((state) => state.employeeCafeteria);
  const cafeteriaKey = employeeCafeteria === "Busters" ? "busters" : "beesweet";
  const status = useCafeteriaStatus((state) => state[cafeteriaKey]);

  const setOpen = useCafeteriaStatus((state) => state.setOpen);
  const setHours = useCafeteriaStatus((state) => state.setHours);
  const fetchStatus = useCafeteriaStatus((state) => state.fetchStatus);
  const [hourDraft, setHourDraft] = useState({
    opensAt: status.opensAt,
    closesAt: status.closesAt,
    sourceOpen: status.opensAt,
    sourceClose: status.closesAt,
  });
  if (hourDraft.sourceOpen !== status.opensAt || hourDraft.sourceClose !== status.closesAt) {
    setHourDraft({
      opensAt: status.opensAt,
      closesAt: status.closesAt,
      sourceOpen: status.opensAt,
      sourceClose: status.closesAt,
    });
  }`;

code = code.replace(regex, replacement.trim());

// And replace isOpen in the JSX
code = code.replace(/isOpen \?/g, 'status.isOpen ?');
code = code.replace(/\{isOpen\}/g, '{status.isOpen}');
code = code.replace(/!isOpen/g, '!status.isOpen');

// Fix setOpen and setHours usages
code = code.replace(/setHours\(hourDraft\.opensAt, hourDraft\.closesAt\);/g, 'setHours(cafeteriaKey, hourDraft.opensAt, hourDraft.closesAt);');
code = code.replace(/onValueChange=\{setOpen\}/g, 'onValueChange={(val) => setOpen(cafeteriaKey, val)}');

// Fix the second declaration of employeeCafeteria
code = code.replace(/const employeeCafeteria = useUserStore\(\(state\) => state\.employeeCafeteria\);\n/g, '');

fs.writeFileSync('src/app/employee/orders/index.tsx', code);
