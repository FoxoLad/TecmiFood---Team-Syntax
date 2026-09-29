import { create } from "zustand";
import { endpoints } from "../constants/api";
import productsData from "../data/products.json";
import { Product } from "../types/product";

type ApiProduct = Product & { _id?: string };

type ProductStore = {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  deleteProduct: (productId: string) => void;
  updateProductsStatus: (orderNumber: number, status: string) => void;
};

// Deja cada producto del API con la forma que esperan las pantallas:
// un id seguro, un número de orden y inStock en false si está inactivo o agotado.
function normalizeProduct(product: ApiProduct, index: number): Product {
  return {
    ...product,
    id: product.id || product._id || `product-${index}`,
    NoOrder: index + 1,
    inStock:
      product.inStock !== false &&
      product.status !== "inactive" &&
      product.status !== "agotado",
    // Las pantallas antiguas de "No Orden" leen este estado como si el producto fuera un pedido.
    status: product.status === "active" ? "Pendiente" : product.status,
  };
}

/** Menú de la app. Empieza con el JSON local y se reemplaza cuando el API responde. */
export const useProductStore = create<ProductStore>()((set, get) => ({
  products: (productsData as Product[]).map((product) => ({
    ...product,
    inStock:
      product.inStock !== false &&
      product.status !== "inactive" &&
      product.status !== "agotado",
  })),
  isLoading: false,
  // Descarga el menú completo (incluye agotados, porque pide ?admin=true).
  // Si el servidor manda una foto de prueba, conserva la imagen local de Bee Sweet.
  fetchProducts: async () => {
    const showLoader = get().products.length === 0;
    if (showLoader) {
      set({ isLoading: true });
    }

    try {
      const res = await fetch(endpoints.products + "?admin=true");
      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
      }

      const data: unknown = await res.json();
      const list = Array.isArray(data) ? (data as ApiProduct[]) : [];
      if (list.length === 0) {
        set({ isLoading: false });
        return;
      }

      const localById = new Map(
        (productsData as Product[]).map((product) => [product.id, product]),
      );

      set({
        products: list.map((product, index) => {
          const normalized = normalizeProduct(product, index);
          const local = localById.get(normalized.id);
          const remoteImage = normalized.image?.trim() ?? "";
          const isPlaceholder =
            !remoteImage || remoteImage.includes("ImagenTestParaProductos");

          if (
            local?.image &&
            isPlaceholder &&
            (normalized.businessId === "BS" || local.businessId === "BS")
          ) {
            return { ...normalized, image: local.image };
          }

          return normalized;
        }),
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching products from API:", error);
      set({ isLoading: false });
    }
  },
  // Quita un producto de la lista en memoria. La pantalla deja de mostrarlo al instante.
  deleteProduct: (productId: string) => {
    set((state) => ({
      products: state.products.filter((product) => product.id !== productId),
    }));
  },
  // Cambia el estado de los productos que comparten el mismo número de orden (vista antigua de "No Orden").
  updateProductsStatus: (orderNumber: number, status: string) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.NoOrder === orderNumber ? { ...product, status } : product,
      ),
    }));
  },
}));
