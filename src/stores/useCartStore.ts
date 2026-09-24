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

export type CartActionResponse = {
  success: boolean;
  reason?: "product_limit" | "total_limit";
};

type CartStore = {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity: number,
    modifications: string[],
    notes: string,
  ) => CartActionResponse;
  updateQuantity: (cartItemId: string, delta: number) => CartActionResponse;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product, quantity, modifications, notes) => {
    let response: CartActionResponse = { success: true };
    set((state) => {
      if (quantity < 1) return state;

      const currentTotal = state.items.reduce((acc, item) => acc + item.quantity, 0);
      if (currentTotal >= 8) {
        response = { success: false, reason: "total_limit" };
        return state;
      }

      const existingProductCount = state.items
        .filter(i => i.product.id === product.id)
        .reduce((sum, i) => sum + i.quantity, 0);

      if (existingProductCount >= 3) {
        response = { success: false, reason: "product_limit" };
        return state;
      }

      const spaceLeftForProduct = 3 - existingProductCount;
      const spaceLeftTotal = 8 - currentTotal;
      const safeQuantity = Math.min(quantity, spaceLeftForProduct, spaceLeftTotal);

      if (safeQuantity < quantity) {
        response = { success: false, reason: spaceLeftForProduct <= spaceLeftTotal ? "product_limit" : "total_limit" };
        if (safeQuantity === 0) return state;
      }

      // Find if an identical item exists
      const existingItemIndex = state.items.findIndex(
        (i) =>
          i.product.id === product.id &&
          JSON.stringify(i.modifications) === JSON.stringify(modifications) &&
          i.notes === notes
      );

      if (existingItemIndex >= 0) {
        const newItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + safeQuantity } : item,
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
    return response;
  },
  updateQuantity: (cartItemId: string, delta: number) => {
    let response: CartActionResponse = { success: true };
    set((state) => {
      const targetItem = state.items.find(i => i.cartItemId === cartItemId);
      if (!targetItem) return state;

      if (delta < 0) {
        const newItems = state.items.map((item) => {
          if (item.cartItemId === cartItemId) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        }).filter((item) => item.quantity > 0);
        return { items: newItems };
      }

      // Delta > 0 (Adding)
      const currentTotal = state.items.reduce((acc, item) => acc + item.quantity, 0);
      if (currentTotal >= 8) {
        response = { success: false, reason: "total_limit" };
        return state;
      }

      const existingProductCount = state.items
        .filter(i => i.product.id === targetItem.product.id)
        .reduce((sum, i) => sum + i.quantity, 0);

      if (existingProductCount >= 3) {
        response = { success: false, reason: "product_limit" };
        return state;
      }

      const newItems = state.items.map((item) => {
        if (item.cartItemId === cartItemId) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });

      return { items: newItems };
    });
    return response;
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
