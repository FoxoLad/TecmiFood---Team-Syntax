import { create } from "zustand";
import { Product } from "../types/product";

type ProductStore = {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  deleteProduct: (productId: string) => void;
  updateProductsStatus: (orderNumber: number, status: string) => void;
};

export const useProductStore = create<ProductStore>()((set) => ({
  products: [],
  isLoading: false,
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(
        "https://tecmifood-team-syntax.onrender.com/api/productos",
      );
      const data = await res.json();

      // Asignamos un NoOrder único a cada producto de la API
      // para simular que cada producto es una orden independiente
      const productsWithOrders = data.map((p: any, index: number) => ({
        ...p,
        NoOrder: index + 1,
        status: p.status === "active" ? "Pendiente" : p.status,
      })) as Product[];

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
