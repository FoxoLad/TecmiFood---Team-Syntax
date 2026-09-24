import os

path = 'src/app/employee/orders/index.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """  const isOpen = useCafeteriaStatus((state) => state.isOpen);
  const opensAt = useCafeteriaStatus((state) => state.opensAt);
  const closesAt = useCafeteriaStatus((state) => state.closesAt);"""

replacement = """  const employeeCafeteria = useUserStore((state) => state.employeeCafeteria);
  const cafeteriaKey = employeeCafeteria === "Busters" ? "busters" : "beesweet";
  const status = useCafeteriaStatus((state) => state[cafeteriaKey]);
  const isOpen = status.isOpen;
  const opensAt = status.opensAt;
  const closesAt = status.closesAt;"""

content = content.replace(target, replacement)
content = content.replace('const employeeCafeteria = useUserStore((state) => state.employeeCafeteria);\n', '')
content = content.replace('setHours(hourDraft.opensAt, hourDraft.closesAt);', 'setHours(cafeteriaKey, hourDraft.opensAt, hourDraft.closesAt);')
content = content.replace('onValueChange={setOpen}', 'onValueChange={(val) => setOpen(cafeteriaKey, val)}')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
