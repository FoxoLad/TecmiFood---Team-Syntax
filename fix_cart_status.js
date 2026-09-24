const fs = require('fs');
let code = fs.readFileSync('src/app/client/(client-tabs)/cart.tsx', 'utf8');

// Replace isOpen variable
code = code.replace(
  /const isOpen = useCafeteriaStatus\(\(state\) => state\.isOpen\);/,
  'const bustersState = useCafeteriaStatus((state) => state.busters);\n  const beesweetState = useCafeteriaStatus((state) => state.beesweet);'
);

// Replace openConfirmModal
const regexModal = /const openConfirmModal = \([\s\S]*?setShowConfirmModal\(true\);\s*\};/;
const replacementModal = `
  const openConfirmModal = (scope: "all" | "busters" | "beesweet") => {
    if (items.length === 0) return;
    
    if (scope === "all" && (!bustersState.isOpen || !beesweetState.isOpen)) {
        Alert.alert("Cafetería cerrada", "No puedes pedir de ambas cafeterías juntas porque alguna está cerrada.");
        return;
    }
    if (scope === "busters" && !bustersState.isOpen) {
        Alert.alert("Cafetería cerrada", "Busters se encuentra cerrada.");
        return;
    }
    if (scope === "beesweet" && !beesweetState.isOpen) {
        Alert.alert("Cafetería cerrada", "Bee Sweet se encuentra cerrada.");
        return;
    }

    setCheckoutScope(scope);
    setConfirmCountdown(2);
    setShowConfirmModal(true);
  };
`;
code = code.replace(regexModal, replacementModal.trim());

// Replace handleCheckout condition
const regexCheckout = /if \(!useCafeteriaStatus\.getState\(\)\.isOpen\) \{[\s\S]*?return;\s*\}/;
const replacementCheckout = `
      const status = useCafeteriaStatus.getState();
      if (checkoutScope === "all" && (!status.busters.isOpen || !status.beesweet.isOpen)) {
        Alert.alert("Cafetería cerrada", "Alguna de las cafeterías está cerrada.");
        setIsSubmitting(false);
        return;
      }
      if (checkoutScope === "busters" && !status.busters.isOpen) {
        Alert.alert("Cafetería cerrada", "Busters está cerrada.");
        setIsSubmitting(false);
        return;
      }
      if (checkoutScope === "beesweet" && !status.beesweet.isOpen) {
        Alert.alert("Cafetería cerrada", "Bee Sweet está cerrada.");
        setIsSubmitting(false);
        return;
      }`;
code = code.replace(regexCheckout, replacementCheckout.trim());

fs.writeFileSync('src/app/client/(client-tabs)/cart.tsx', code);
