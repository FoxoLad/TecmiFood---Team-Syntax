//Diccionario para Mapeo de Nombres / Limpieza de Texto / Tolerancia de Errores / Resolución de Imágenes

//Mostrar la imagen correspondiente al nombre
export const productsImages = {
  CJQ: require("../../assets/images/product-icons/CJQ.png"),
  Latte: require("../../assets/images/product-icons/Latte.png"),
  Espresso: require("../../assets/images/product-icons/Espresso.png"),
  "Arizona GT": require("../../assets/images/product-icons/Arizona GT.png"),
  Mocha: require("../../assets/images/product-icons/Mocha.png"),
  "Pan de platano": require("../../assets/images/product-icons/PanPlatano.png"),
  Ate: require("../../assets/images/product-icons/ate.png"),
  AguaMine: require("../../assets/images/product-icons/AguaMine.png"),
  Avena: require("../../assets/images/product-icons/Avena.jpg"),
  BanApp: require("../../assets/images/product-icons/BanApp.png"),
  ChaiFrap: require("../../assets/images/product-icons/ChaiFrap.jpg"),
  "C&CFrap": require("../../assets/images/product-icons/C&CFrap.jpg"),
  CaraFrap: require("../../assets/images/product-icons/CaraFrap.jpg"),
  ChapataPomo: require("../../assets/images/product-icons/chapataPomo.jpg"),
  CroissantNute: require("../../assets/images/product-icons/CroissantNute.jpg"),
  D2Queso: require("../../assets/images/product-icons/D2Queso.jpg"),
  GalletaChispa: require("../../assets/images/product-icons/GalletaChispa.jpg"),
  GalletaKinder: require("../../assets/images/product-icons/GalletaKinder.jpg"),
  MochaFrap: require("../../assets/images/product-icons/mochafrap.jpg"),
  PizzaPita: require("../../assets/images/product-icons/PizzaPita.jpg"),
  Smoothie: require("../../assets/images/product-icons/Smoothie.jpg"),
  TisanaFrap: require("../../assets/images/product-icons/TisanaFrap.jpg"),
  Yogurt: require("../../assets/images/product-icons/yogurt.jpg"),
  Arizona: require("../../assets/images/product-icons/Arizona.png"),
  ate: require("../../assets/images/product-icons/ate.png"),
  mazapan: require("../../assets/images/product-icons/mazapan.png"),
  gomitasWelch: require("../../assets/images/product-icons/gomitasWelch.png"),
  RKTreat: require("../../assets/images/product-icons/RKTreat.jpg"),
  BarraP: require("../../assets/images/product-icons/BarraP.jpg"),
  ObleaAm: require("../../assets/images/product-icons/ObleaAm.jpg"),
  saborines: require("../../assets/images/product-icons/saborines.jpeg"),
  brownie: require("../../assets/images/product-icons/brownie.jpg"),
  "c&c Brown": require("../../assets/images/product-icons/c&c Brown.jpg"),
  muffins: require("../../assets/images/product-icons/muffins.jpg"),
  carlotaLim: require("../../assets/images/product-icons/carlotaLim.jpg"),
  carlotaOreo: require("../../assets/images/product-icons/carlotaOreo.jpg"),
  macaron: require("../../assets/images/product-icons/macaron.jpg"),
  "conejo turin": require("../../assets/images/product-icons/conejo turin.webp"),
  CocaOrig: require("../../assets/images/product-icons/CocaOrig.jpg"),
  Cocazero: require("../../assets/images/product-icons/Cocazero.jpg"),
  freelife: require("../../assets/images/product-icons/freelife.png"),
  schweppes: require("../../assets/images/product-icons/schweppes.jpg"),
  boingjugo: require("../../assets/images/product-icons/boingjugo.png"),
  snapple: require("../../assets/images/product-icons/snapple.jpg"),
  JumexScool: require("../../assets/images/product-icons/JumexScool.png"),
  jumex: require("../../assets/images/product-icons/jumex.png"),
  Electrolite: require("../../assets/images/product-icons/Electrolite.png"),
  banderrilla: require("../../assets/images/product-icons/banderrilla.jpg"),
  Molletes: require("../../assets/images/product-icons/Molletes.jpg"),
  "sandwich J&Q": require("../../assets/images/product-icons/sandwich J&Q.jpg"),
  bagel: require("../../assets/images/product-icons/bagel.jpg"),
  chapata: require("../../assets/images/product-icons/chapata.jpg"),
  chilaquiles: require("../../assets/images/product-icons/chilaquiles.jpg"),
  "HambSen}": require("../../assets/images/product-icons/HambSen}.jpg"),
  ChapataPP: require("../../assets/images/product-icons/ChapataPP.jpg"),
  ensalada: require("../../assets/images/product-icons/ensalada.jpg"),
  HambDob: require("../../assets/images/product-icons/HambDob.jpg"),
  BusterBurg: require("../../assets/images/product-icons/BusterBurg.jpg"),
  chilaquilesMila: require("../../assets/images/product-icons/chilaquilesMila.jpg"),
  cafefrap: require("../../assets/images/product-icons/cafefrap.jpg"),
  mochafrap: require("../../assets/images/product-icons/mochafrap.jpg"),
  YogurtFrap: require("../../assets/images/product-icons/YogurtFrap.jpg"),
  "2022-02_Sandwich Pavo Panela_1": require("../../assets/images/product-icons/2022-02_Sandwich Pavo Panela_1.png"),
  jocho: require("../../assets/images/product-icons/jocho.jpg"),
};

const bustersProductImages: Record<string, keyof typeof productsImages> = {
  "Cuadritos de ate": "ate",
  "Mazapan pieza": "mazapan",
  "Gomitas Welch's": "gomitasWelch",
  Fruta: "BanApp",
  "Barra vainilla Rice Krispies": "RKTreat",
  "Barra proteína cacahuate": "BarraP",
  "Obleas de amaranto": "ObleaAm",
  Saborines: "saborines",
  "Brownie Chocolate JB": "brownie",
  "Brownie Oreo JB": "c&c Brown",
  Muffins: "muffins",
  "Carlota de limón": "carlotaLim",
  "Carlota Oreo": "carlotaOreo",
  "Galletas chispas chocolate": "GalletaChispa",
  "Galletas Chispas Georgio Kinder M M": "GalletaKinder",
  "Croissant Nutella": "CroissantNute",
  Macarrón: "macaron",
  "Conejito Turin": "conejo turin",
  "Agua medio litro": "AguaMine",
  "Agua Bonafont y Libre 1 litro": "AguaMine",
  "Coca Cola Zero": "Cocazero",
  "Coca Cola Regular": "CocaOrig",
  "Agua Mineral": "AguaMine",
  "Free Life": "freelife",
  "Schweppes Ginger": "schweppes",
  "Arizona tamaño regular": "Arizona",
  Boing: "boingjugo",
  Snapple: "snapple",
  "Arizona tamaño jumbo": "Arizona GT",
  "Jugo JUMEX": "jumex",
  "Jugo School JUMEX": "JumexScool",
  Electrolit: "Electrolite",
  Yogurt: "Yogurt",
  Banderilla: "banderrilla",
  "Mollete 2 piezas": "Molletes",
  "Sandwich jamón y queso": "sandwich J&Q",
  "Pizza pita jamón y queso": "PizzaPita",
  "Croissant jamón y queso": "CJQ",
  "Pizza pita Pepperoni": "PizzaPita",
  "Sandwich panela y espinaca": "2022-02_Sandwich Pavo Panela_1",
  "Dedos de queso venezolanos 3 piezas": "D2Queso",
  "Hot dog": "jocho",
  Avena: "Avena",
  Bagel: "bagel",
  "Chapata doble jamón y queso": "chapata",
  "Chilaquiles naturales": "chilaquiles",
  "Hamburguesa de Res Sencilla": "HambSen}",
  "Baguette pollo y pomodoro": "ChapataPomo",
  "Chapata PEPE": "ChapataPP",
  "Ensalada de pollo o atún": "ensalada",
  "Hamburguesa de Res doble": "HambDob",
  "Buster Burger": "BusterBurg",
  "Chilaquiles con milanesa de pollo": "chilaquilesMila",
  "Frappé Café": "cafefrap",
  "Frappé Mocha / Mocha Blanco": "mochafrap",
  "Frappé Caramelo": "CaraFrap",
  "Frappé Cookies & Cream": "C&CFrap",
  "Frappé Yoghurt Fresa / Mango": "YogurtFrap",
  "Smoothie Fresa / Mango": "Smoothie",
  "Frappé Chai": "ChaiFrap",
  "Tisana Frappé": "TisanaFrap",
  "Licuado Plátano / Fresa / Mango": "Smoothie",
  "1pz de Fruta: Plátano o Manzana": "BanApp",
  "Galletas Giorgio Kinder M&M": "GalletaKinder",
  "Capuchino Italiano": "Latte",
  "Café Americano": "Espresso",
  "Espresso Americano": "Espresso",
  "Café Latte": "Latte",
  "Mocha / Mocha Blanco": "Mocha",
  Espresso: "Espresso",
  Tisana: "TisanaFrap",
  Chai: "ChaiFrap",
};

//Función que normaliza el texto
function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/\b1\s*lt\b/g, "litro")
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

//Función que divide el texto en piezas para la búsqueda de imágenes por similitud de texto
function tokensOf(value: string) {
  return normalize(value)
    .split(" ")
    .filter(
      (token) =>
        token.length >= 3 &&
        token !== "pieza" &&
        token !== "piezas" &&
        !/^\d/.test(token),
    );
}

//Función para verificar la similitud entre dos textos
function editDistance(left: string, right: string) {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let previous = row[0];
    row[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const current = row[rightIndex];
      const cost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      row[rightIndex] = Math.min(
        row[rightIndex] + 1,
        row[rightIndex - 1] + 1,
        previous + cost,
      );
      previous = current;
    }
  }
  return row[right.length];
}

//Función que verifica si dos textos son iguales
function tokensMatch(left: string, right: string) {
  if (left === right) {
    return true;
  }
  const difference = Math.abs(left.length - right.length);
  if (difference <= 2 && (left.startsWith(right) || right.startsWith(left))) {
    return true;
  }
  return (
    left.length >= 5 &&
    right.length >= 5 &&
    difference <= 1 &&
    editDistance(left, right) <= 1
  );
}

//Función que verifica si dos conjuntos de piezas son iguales para encontrar la imagen correspondiente al producto
function sameTokens(left: string[], right: string[]) {
  if (left.length === 0 || right.length === 0 || left.length !== right.length) {
    return false;
  }
  const pending = [...right];
  return left.every((token) => {
    const index = pending.findIndex((other) => tokensMatch(token, other));
    if (index < 0) {
      return false;
    }
    pending.splice(index, 1);
    return true;
  });
}

//Función que encuentra la imagen correspondiente al producto
function matchingImageKey(productName: string) {
  const nameTokens = tokensOf(productName);
  for (const [catalogName, imageKey] of Object.entries(bustersProductImages)) {
    if (sameTokens(nameTokens, tokensOf(catalogName))) {
      return imageKey;
    }
  }
  return null;
}

//Función que extrae el nombre del archivo de una imagen
function imageStem(image: string) {
  const file = decodeURIComponent(
    image.split("?")[0]?.split("/").pop() ?? image,
  );
  return file.replace(/\.[a-z0-9]+$/i, "");
}

//Función que obtiene la imagen correspondiente al producto
export function getBustersProductImageSource(productName: string) {
  const imageKey =
    matchingImageKey(productName) ?? bustersProductImages[productName];
  return imageKey ? productsImages[imageKey] : null;
}

//Tipos de entrada para la función resolveProductImageSource -->
type ProductImageInput = {
  image?: string | null;
  name?: string | null;
};

//Función que resuelve la imagen del producto
export function resolveProductImageSource({ image, name }: ProductImageInput) {
  const imageValue = image?.trim() ?? "";

  //Si la imagen es Base64 o un URL (http/https), se usa directamente sin validaciones de nombre
  if (
    imageValue.startsWith("data:image") ||
    imageValue.startsWith("http://") ||
    imageValue.startsWith("https://")
  ) {
    return { uri: imageValue };
  }

  const productName = name?.trim() ?? "";
  const agreedKey = productName ? matchingImageKey(productName) : null;
  if (agreedKey) {
    return productsImages[agreedKey];
  }

  if (!imageValue || !productName) {
    return null;
  }

  const stem = imageStem(imageValue);
  if (!sameTokens(tokensOf(stem), tokensOf(productName))) {
    return null;
  }

  const knownKey = (
    Object.keys(productsImages) as (keyof typeof productsImages)[]
  ).find((key) => normalize(key) === normalize(stem));
  if (knownKey) {
    return productsImages[knownKey];
  }

  return null;
}

export function getProductImageSource(image: string, name?: string) {
  return resolveProductImageSource({ image, name });
}
