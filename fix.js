const fs = require('fs');
let code = fs.readFileSync('src/app/employee/orders/index.tsx', 'utf8').replace(/\r\n/g, '\n');

const t1 = "  const isOpen = useCafeteriaStatus((state) => state.isOpen);\n  const opensAt = useCafeteriaStatus((state) => state.opensAt);\n  const closesAt = useCafeteriaStatus((state) => state.closesAt);";
const r1 = "  const employeeCafeteria = useUserStore((state) => state.employeeCafeteria);\n  const cafeteriaKey = employeeCafeteria === 'Busters' ? 'busters' : 'beesweet';\n  const status = useCafeteriaStatus((state) => state[cafeteriaKey]);\n  const isOpen = status.isOpen;\n  const opensAt = status.opensAt;\n  const closesAt = status.closesAt;";

code = code.split(t1).join(r1);
code = code.replace(/const employeeCafeteria = useUserStore\(\(state\) => state\.employeeCafeteria\);\n/g, '');
code = code.split("const cafeteriaKey =").join("const employeeCafeteria = useUserStore((state) => state.employeeCafeteria);\n  const cafeteriaKey =");

code = code.split("setHours(hourDraft.opensAt, hourDraft.closesAt);").join("setHours(cafeteriaKey, hourDraft.opensAt, hourDraft.closesAt);");
code = code.split("onValueChange={setOpen}").join("onValueChange={(val) => setOpen(cafeteriaKey, val)}");

fs.writeFileSync('src/app/employee/orders/index.tsx', code);
