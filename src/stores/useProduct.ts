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
  fetchProducts: async () => {
    const showLoader = get().products.length === 0;
    if (showLoader) {
      set({ isLoading: true });
    }

    try {
      const res = await fetch(endpoints.products);
      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
      }

      const data: unknown = await res.json();
      const list = Array.isArray(data) ? (data as ApiProduct[]) : [];
      if (list.length === 0) {
        set({ isLoading: false });
        return;
      }

      set({ products: list.map(normalizeProduct), isLoading: false });
    } catch (error) {
      console.error("Error fetching products from API:", error);
      set({ isLoading: false });
    }
  },
  deleteProduct: (productId: string) => {
    set((state) => ({
      products: state.products.filter((product) => product.id !== productId),
    }));
  },
  updateProductsStatus: (orderNumber: number, status: string) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.NoOrder === orderNumber ? { ...product, status } : product,
      ),
    }));
  },
}));
