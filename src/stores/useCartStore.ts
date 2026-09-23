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
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product, quantity, modifications, notes) => {
    set((state) => {
      // Check total items constraint (max 8)
      const currentTotal = state.items.reduce((acc, i) => acc + i.quantity, 0);
      if (currentTotal + quantity > 8) {
        return state; // Do not add if it exceeds 8
      }

      // Find if an identical item exists (same product, same mods, same notes)
      const existingItemIndex = state.items.findIndex(
        (i) =>
          i.product.id === product.id &&
          JSON.stringify(i.modifications) === JSON.stringify(modifications) &&
          i.notes === notes
      );

      if (existingItemIndex >= 0) {
        // Group them
        const newItems = [...state.items];
        const existingItem = newItems[existingItemIndex];
        
        // Enforce max 3 limit per distinct item
        if (existingItem.quantity + quantity <= 3) {
          existingItem.quantity += quantity;
        } else {
          existingItem.quantity = 3;
        }
        
        return { items: newItems };
      }

      // Add new item if not grouped
      const cartItemId = Math.random().toString(36).substring(7);
      return {
        items: [
          ...state.items,
          { cartItemId, product, quantity, modifications, notes },
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
