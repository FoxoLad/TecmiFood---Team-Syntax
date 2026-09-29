/**
 * Asigna a cada producto Bee Sweet una URL de Unsplash
 * que coincide con su título (tipo + sabor).
 * Uso: node scripts/assign-beesweet-images.js
 */
const fs = require("fs");
const path = require("path");

const productsPath = path.join(__dirname, "../src/data/products.json");

// Arma el enlace de Unsplash con tamaño y calidad fijos a partir del id de la foto.
const q = (id) =>
  `https://images.unsplash.com/${id}?w=800&q=80&auto=format&fit=crop`;

/** Imágenes por tipo de producto (Unsplash). */
const BY_TYPE = {
  macarrones: q("photo-1577859369205-6de8f02d8335"),
  waffle: q("photo-1562376552-0d160a2f238d"),
  crepa: q("photo-1519676867240-f03562e64548"),
  pastel: q("photo-1578985545062-69928b1d9587"),
  cheesecake: q("photo-1524351199678-941a58a3df50"),
  helado: q("photo-1563805042-7684c019e1cb"),
  smoothie: q("photo-1505252585461-04db1eb84625"),
  frappe: q("photo-1461023058943-07fcbe16d735"),
  malteada: q("photo-1572490122747-3968b75cc699"),
  cafehelado: q("photo-1517701604599-bb29b565090c"),
  tehelado: q("photo-1556679343-c7306c1976bc"),
  muffin: q("photo-1607958996333-41aef7caefaa"),
  galleta: q("photo-1499636136210-6f4ee915583e"),
  gelatina: q("photo-1488477181946-6428a0291777"),
  trufas: q("photo-1548907040-4baa42d10919"),
};

/** Preferencia por sabor cuando hay imagen más específica. */
const BY_FLAVOR = {
  chocolate: {
    pastel: q("photo-1606890737304-57a1ca8a5b62"),
    crepa: q("photo-1519676867240-f03562e64548"),
    helado: q("photo-1563805042-7684c019e1cb"),
    galleta: q("photo-1499636136210-6f4ee915583e"),
    waffle: q("photo-1562376552-0d160a2f238d"),
    default: q("photo-1606890737304-57a1ca8a5b62"),
  },
  fresa: {
    helado: q("photo-1497034825429-c343d7c6a68f"),
    cheesecake: q("photo-1533134242443-d4fd215305ad"),
    gelatina: q("photo-1488477181946-6428a0291777"),
    smoothie: q("photo-1553530666-ba11a7da3888"),
    tehelado: q("photo-1556679343-c7306c1976bc"),
    default: q("photo-1464965911861-746a04b4bca6"),
  },
  matcha: {
    waffle: q("photo-1515823662972-da6a2e4d4606"),
    pastel: q("photo-1515823662972-da6a2e4d4606"),
    crepa: q("photo-1515823662972-da6a2e4d4606"),
    frappe: q("photo-1515823662972-da6a2e4d4606"),
    smoothie: q("photo-1515823662972-da6a2e4d4606"),
    malteada: q("photo-1515823662972-da6a2e4d4606"),
    macarrones: q("photo-1569864358642-9d1684040f43"),
    galleta: q("photo-1757345016219-7b3b8a1b9fba"),
    default: q("photo-1515823662972-da6a2e4d4606"),
  },
  oreo: {
    crepa: q("photo-1558961363-fa8fdf82db35"),
    helado: q("photo-1624353365286-3f8d62daad51"),
    frappe: q("photo-1572490122747-3968b75cc699"),
    cheesecake: q("photo-1624353365286-3f8d62daad51"),
    smoothie: q("photo-1572490122747-3968b75cc699"),
    waffle: q("photo-1558961363-fa8fdf82db35"),
    cafehelado: q("photo-1572490122747-3968b75cc699"),
    macarrones: q("photo-1558326567-98ae2405596b"),
    default: q("photo-1558961363-fa8fdf82db35"),
  },
  vainilla: {
    malteada: q("photo-1579954115546-c3b05b0a0c1c"),
    frappe: q("photo-1579954115546-c3b05b0a0c1c"),
    helado: q("photo-1497034825429-c343d7c6a68f"),
    cafehelado: q("photo-1517701604599-bb29b565090c"),
    cheesecake: q("photo-1524351199678-941a58a3df50"),
    default: q("photo-1579954115546-c3b05b0a0c1c"),
  },
  cajeta: {
    waffle: q("photo-1484723091739-30a097e8f929"),
    pastel: q("photo-1464349095431-e9a21285b5f3"),
    malteada: q("photo-1572490122747-3968b75cc699"),
    cafehelado: q("photo-1461023058943-07fcbe16d735"),
    tehelado: q("photo-1484723091739-30a097e8f929"),
    macarrones: q("photo-1558326567-98ae2405596b"),
    trufas: q("photo-1548907040-4baa42d10919"),
    default: q("photo-1484723091739-30a097e8f929"),
  },
  zarzamora: {
    waffle: q("photo-1562376552-0d160a2f238d"),
    galleta: q("photo-1558961363-fa8fdf82db35"),
    smoothie: q("photo-1553530666-ba11a7da3888"),
    malteada: q("photo-1553530666-ba11a7da3888"),
    pastel: q("photo-1565958011703-44f9829ba187"),
    macarrones: q("photo-1577859369205-6de8f02d8335"),
    default: q("photo-1553530666-ba11a7da3888"),
  },
  almendra: {
    macarrones: q("photo-1558326567-98ae2405596b"),
    crepa: q("photo-1519676867240-f03562e64548"),
    smoothie: q("photo-1505252585461-04db1eb84625"),
    cafehelado: q("photo-1517701604599-bb29b565090c"),
    malteada: q("photo-1572490122747-3968b75cc699"),
    cheesecake: q("photo-1524351199678-941a58a3df50"),
    muffin: q("photo-1607958996333-41aef7caefaa"),
    trufas: q("photo-1548907040-4baa42d10919"),
    galleta: q("photo-1499636136210-6f4ee915583e"),
    default: q("photo-1558326567-98ae2405596b"),
  },
  nuez: {
    pastel: q("photo-1464349095431-e9a21285b5f3"),
    macarrones: q("photo-1558326567-98ae2405596b"),
    crepa: q("photo-1519676867240-f03562e64548"),
    cheesecake: q("photo-1524351199678-941a58a3df50"),
    gelatina: q("photo-1488477181946-6428a0291777"),
    tehelado: q("photo-1556679343-c7306c1976bc"),
    galleta: q("photo-1499636136210-6f4ee915583e"),
    muffin: q("photo-1607958996333-41aef7caefaa"),
    smoothie: q("photo-1505252585461-04db1eb84625"),
    default: q("photo-1464349095431-e9a21285b5f3"),
  },
  taro: {
    muffin: q("photo-1607958996333-41aef7caefaa"),
    galleta: q("photo-1558961363-fa8fdf82db35"),
    frappe: q("photo-1553530666-ba11a7da3888"),
    crepa: q("photo-1519676867240-f03562e64548"),
    helado: q("photo-1563805042-7684c019e1cb"),
    default: q("photo-1553530666-ba11a7da3888"),
  },
  moka: {
    waffle: q("photo-1461023058943-07fcbe16d735"),
    gelatina: q("photo-1488477181946-6428a0291777"),
    galleta: q("photo-1499636136210-6f4ee915583e"),
    trufas: q("photo-1548907040-4baa42d10919"),
    default: q("photo-1461023058943-07fcbe16d735"),
  },
  rompope: {
    helado: q("photo-1497034825429-c343d7c6a68f"),
    crepa: q("photo-1519676867240-f03562e64548"),
    frappe: q("photo-1579954115546-c3b05b0a0c1c"),
    smoothie: q("photo-1505252585461-04db1eb84625"),
    malteada: q("photo-1572490122747-3968b75cc699"),
    waffle: q("photo-1562376552-0d160a2f238d"),
    galleta: q("photo-1499636136210-6f4ee915583e"),
    default: q("photo-1579954115546-c3b05b0a0c1c"),
  },
};

// Lee el nombre y dice de qué tipo es: pastel, frappe, galleta, etc.
function detectType(name) {
  const n = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (n.includes("macarron")) return "macarrones";
  if (n.includes("waffle")) return "waffle";
  if (n.includes("crepa")) return "crepa";
  if (n.includes("cheesecake")) return "cheesecake";
  if (n.includes("pastel")) return "pastel";
  if (n.includes("helado de") || n.startsWith("helado")) return "helado";
  if (n.includes("smoothie")) return "smoothie";
  if (n.includes("frappe") || n.includes("frappé")) return "frappe";
  if (n.includes("malteada")) return "malteada";
  if (n.includes("cafe helado") || n.includes("café helado")) return "cafehelado";
  if (n.includes("te helado") || n.includes("té helado")) return "tehelado";
  if (n.includes("muffin")) return "muffin";
  if (n.includes("galleta")) return "galleta";
  if (n.includes("gelatina")) return "gelatina";
  if (n.includes("trufas")) return "trufas";
  return null;
}

// Busca un sabor dentro del nombre (chocolate, fresa, matcha...). Si no hay, regresa null.
function detectFlavor(name) {
  const n = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const flavors = [
    "chocolate",
    "fresa",
    "matcha",
    "oreo",
    "vainilla",
    "cajeta",
    "zarzamora",
    "almendra",
    "nuez",
    "taro",
    "moka",
    "rompope",
  ];
  return flavors.find((f) => n.includes(f)) ?? null;
}

// Elige la foto: primero por sabor y tipo, luego solo por tipo, y si nada coincide usa la de pastel.
function imageFor(name) {
  const type = detectType(name);
  const flavor = detectFlavor(name);
  if (flavor && BY_FLAVOR[flavor]) {
    const flavored = BY_FLAVOR[flavor];
    if (type && flavored[type]) return flavored[type];
    if (flavored.default) return flavored.default;
  }
  if (type && BY_TYPE[type]) return BY_TYPE[type];
  return BY_TYPE.pastel;
}

const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
let updated = 0;
const used = new Map();

for (const product of products) {
  if (product.businessId !== "BS") continue;
  const url = imageFor(product.name);
  product.image = url;
  updated += 1;
  used.set(url, (used.get(url) || 0) + 1);
}

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2) + "\n");

console.log(`Actualizados ${updated} productos Bee Sweet`);
console.log(`URLs distintas: ${used.size}`);
console.log("Ejemplos:");
products
  .filter((p) => p.businessId === "BS")
  .slice(0, 8)
  .forEach((p) => console.log(`  ${p.name} -> ${p.image}`));
