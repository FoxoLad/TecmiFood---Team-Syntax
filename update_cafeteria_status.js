const fs = require('fs');
const file = 'src/stores/useCafeteriaStatus.ts';
let code = fs.readFileSync(file, 'utf8');

const fetchStatusReplacement = `fetchStatus: async () => {
        try {
          const response = await fetch(endpoints.cafeteria);
          if (!response.ok) {
            return;
          }
          const data = await response.json();
          
          const newOpensAt = data.opensAt && isValidTime(data.opensAt) ? data.opensAt : get().opensAt;
          const newClosesAt = data.closesAt && isValidTime(data.closesAt) ? data.closesAt : get().closesAt;
          let computedIsOpen = typeof data.isOpen === "boolean" ? data.isOpen : get().isOpen;
          
          if (computedIsOpen) {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            const [oH, oM] = newOpensAt.split(':').map(Number);
            const [cH, cM] = newClosesAt.split(':').map(Number);
            const openMins = oH * 60 + oM;
            const closeMins = cH * 60 + cM;
            
            let isWithinHours = false;
            if (closeMins < openMins) {
               isWithinHours = currentMinutes >= openMins || currentMinutes < closeMins;
            } else {
               isWithinHours = currentMinutes >= openMins && currentMinutes < closeMins;
            }
            
            if (!isWithinHours) {
               computedIsOpen = false;
               pushStatus({ isOpen: false, opensAt: newOpensAt, closesAt: newClosesAt });
            }
          }

          set({
            isOpen: computedIsOpen,
            opensAt: newOpensAt,
            closesAt: newClosesAt,
          });
        } catch (error) {
          console.error("No se pudo leer el estado de la cafetería:", error);
        }
      }`;

code = code.replace(/fetchStatus: async \(\) => \{[\s\S]*?\},(?=\n\s*setOpen)/, fetchStatusReplacement + ',');

fs.writeFileSync(file, code);
