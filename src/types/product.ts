/** Producto del menú. `inStock` puede faltar en datos locales: entonces se considera disponible. */
export type Product = {
  NoOrder?: number;
  id: string;
  businessId: string;
  name: string;
  description: string;
  modifications?: string | { name: string; price: number }[];
  price: number;
  image: string;
  status?: string;
  category: string;
  subcategory?: string;
  inStock?: boolean;
};

export function isProductAvailable(product: Pick<Product, "inStock" | "status">) {
  if (product.inStock === false) {
    return false;
  }

  const status = (product.status ?? "").toLowerCase();
  return status !== "inactive" && status !== "agotado" && status !== "unavailable";
}

/** Convierte las modificaciones del menú en etiquetas que el cliente puede marcar. */
export function modificationLabels(product: Pick<Product, "modifications" | "category">) {
  const custom = product.modifications;

  if (Array.isArray(custom) && custom.length > 0) {
    return custom.map((modification) =>
      typeof modification === "string" ? modification : modification.name,
    );
  }

  if (typeof custom === "string" && custom.trim()) {
    return custom.split(",").map((modification) => modification.trim()).filter(Boolean);
  }

  if (product.category === "Alimentos" || product.category === "Comidas") {
    return ["Sin salsa", "Sin ingredientes picantes", "Extra servilletas"];
  }

  if (
    product.category === "Bebidas" ||
    product.category === "Frappe" ||
    product.category === "Bebidas Calientes o Heladas"
  ) {
    return ["Sin hielo", "Poco hielo", "Sin azúcar"];
  }

  return ["Sin bolsa", "Empaque separado", "Extra servilletas"];
}
