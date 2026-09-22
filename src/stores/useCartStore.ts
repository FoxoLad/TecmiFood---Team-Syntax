import { create } from "zustand";
import { Product } from "../types/product";

export type CartItem = {
  cartItemId: string;
  product: Product;
  quantity: number;
  modifications: string[];
  notes: string;
};

type CartStore = {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity: number,
    modifications: string[],
    notes: string,
  ) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product, quantity, modifications, notes) => {
    const cartItemId = Math.random().toString(36).substring(7);
    set((state) => ({
      items: [
        ...state.items,
        { cartItemId, product, quantity, modifications, notes },
      ],
    }));
  },
  removeItem: (cartItemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.cartItemId !== cartItemId),
    }));
  },
  clearCart: () => {
    set({ items: [] });
  },
  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  },
}));
