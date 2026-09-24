import { create } from "zustand";
import { endpoints } from "../constants/api";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  modifications: string[];
  notes?: string;
};

export type RealOrder = {
  _id: string;
  orderNumber: number;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

interface OrderStore {
  orders: RealOrder[];
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  rememberOrder: (order: RealOrder) => void;
  updateOrderStatus: (orderNumber: number, status: string) => Promise<void>;
  deleteOrder: (orderNumber: number) => Promise<void>;
}

export function isRealOrder(value: unknown): value is RealOrder {
  if (!value || typeof value !== "object") {
    return false;
  }

  const order = value as Partial<RealOrder>;
  return typeof order.orderNumber === "number" && Array.isArray(order.items);
}

/** Pedidos reales guardados en el backend. La lista se actualiza al enfocar las pantallas. */
export const useOrders = create<OrderStore>((set, get) => ({
  orders: [],
  isLoading: false,
  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(endpoints.orders);
      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
      }

      const data: unknown = await res.json();
      set({ orders: Array.isArray(data) ? data : [], isLoading: false });
    } catch (error) {
      console.error("Error fetching orders:", error);
      set({ isLoading: false });
    }
  },
  rememberOrder: (order) => {
    set((state) => ({
      orders: [order, ...state.orders.filter((current) => current._id !== order._id)],
    }));
  },
  
  deleteOrder: async (orderNumber: number) => {
    const previous = get().orders;
    set({ orders: previous.filter(o => o.orderNumber !== orderNumber) });
    try {
      const res = await fetch(`${endpoints.orders}/${orderNumber}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("No se pudo eliminar en la nube");
    } catch (error) {
      console.error(error);
      set({ orders: previous });
    }
  },
  updateOrderStatus: async (orderNumber, status) => {
    const previous = get().orders;
    // El cambio se ve de inmediato; si el servidor lo rechaza, se restaura la lista.
    set({
      orders: previous.map((order) =>
        order.orderNumber === orderNumber ? { ...order, status } : order,
      ),
    });

    try {
      const res = await fetch(endpoints.orderStatus(orderNumber), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        throw new Error("No se pudo actualizar en la nube");
      }
    } catch (error) {
      console.error(error);
      set({ orders: previous });
      get().fetchOrders();
    }
  },
}));
