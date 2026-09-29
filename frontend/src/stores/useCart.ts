/**
 * Carrito anterior, conservado por compatibilidad.
 * Las pantallas usan `useCartStore` de `useCartStore.ts`.
 */
import { create } from "zustand";
import { Product } from "../types/product";

export const MAX_PRODUCT_QUANTITY = 4;

export type CartItem = {
  product: Product;
  quantity: number;
  modifications: string[];
  notes: string;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()((set) => ({
  items: [],
  // Versión anterior del carrito. Las pantallas actuales usan useCartStore.ts.
  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        { ...item, quantity: Math.min(MAX_PRODUCT_QUANTITY, Math.max(1, item.quantity)) },
      ],
    })),
  // Cambia la cantidad de un renglón, siempre entre 1 y MAX_PRODUCT_QUANTITY (4).
  updateQuantity: (index, quantity) =>
    set((state) => ({
      items: state.items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              quantity: Math.min(MAX_PRODUCT_QUANTITY, Math.max(1, quantity)),
            }
          : item,
      ),
    })),
  // Elimina el renglón que está en esa posición de la lista.
  removeItem: (index) =>
    set((state) => ({
      items: state.items.filter((_, itemIndex) => itemIndex !== index),
    })),
  // Deja el carrito sin productos.
  clearCart: () => set({ items: [] }),
}));