import { create } from "zustand";
import { Product } from "../types/product";
import productsData from "../data/products.json";

type ApiProduct = Product & { _id?: string };

type ProductStore = {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  deleteProduct: (productId: string) => void;
  updateProductsStatus: (orderNumber: number, status: string) => void;
};

export const useProductStore = create<ProductStore>()((set) => ({
  products: productsData as Product[],
  isLoading: false,
  fetchProducts: async () => {
    // Avoid blocking on initial load, background refresh

    try {
      const res = await fetch(
        "https://tecmifood-team-syntax.onrender.com/api/productos",
      );
      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
      }

      const data: unknown = await res.json();
      const list = Array.isArray(data) ? (data as ApiProduct[]) : [];

      // Asignamos un NoOrder único a cada producto de la API
      // para simular que cada producto es una orden independiente
      const productsWithOrders = list.map((product, index) => ({
        ...product,
        id: product.id || product._id || `product-${index}`,
        NoOrder: index + 1,
        status: product.status === "active" ? "Pendiente" : product.status,
      }));

      set({ products: productsWithOrders, isLoading: false });
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
