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
  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        { ...item, quantity: Math.min(MAX_PRODUCT_QUANTITY, Math.max(1, item.quantity)) },
      ],
    })),
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
  removeItem: (index) =>
    set((state) => ({
      items: state.items.filter((_, itemIndex) => itemIndex !== index),
    })),
  clearCart: () => set({ items: [] }),
}));