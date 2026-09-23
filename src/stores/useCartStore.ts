import { create } from "zustand";
import { Product } from "../types/product";

/** Límites del pedido: 3 unidades iguales y 8 productos en total. */

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
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product, quantity, modifications, notes) => {
    set((state) => {
      const safeQuantity = Math.min(3, quantity);
      if (safeQuantity < 1) {
        return state;
      }

      const currentTotal = state.items.reduce((acc, item) => acc + item.quantity, 0);
      if (currentTotal + safeQuantity > 8) {
        return state;
      }

      // Find if an identical item exists (same product, same mods, same notes)
      const existingItemIndex = state.items.findIndex(
        (i) =>
          i.product.id === product.id &&
          JSON.stringify(i.modifications) === JSON.stringify(modifications) &&
          i.notes === notes
      );

      if (existingItemIndex >= 0) {
        const existingItem = state.items[existingItemIndex];
        const nextQuantity = Math.min(3, existingItem.quantity + safeQuantity);
        if (nextQuantity === existingItem.quantity) {
          return state;
        }

        const newItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: nextQuantity } : item,
        );
        return { items: newItems };
      }

      const cartItemId = `${product.id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      return {
        items: [
          ...state.items,
          { cartItemId, product, quantity: safeQuantity, modifications, notes },
        ],
      };
    });
  },
  updateQuantity: (cartItemId: string, delta: number) => {
    set((state) => {
      const newItems = state.items.map((item) => {
        if (item.cartItemId === cartItemId) {
          let newQuantity = item.quantity + delta;
          // Check limits: max 3 per item
          if (newQuantity > 3) newQuantity = 3;
          
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item) => item.quantity > 0); // Removing if quantity becomes 0

      // Enforce total max 8
      const newTotal = newItems.reduce((acc, i) => acc + i.quantity, 0);
      if (newTotal > 8 && delta > 0) {
        return state; // Cancel the change if it exceeds global 8
      }
      
      return { items: newItems };
    });
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
