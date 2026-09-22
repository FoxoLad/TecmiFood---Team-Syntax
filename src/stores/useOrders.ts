import { create } from "zustand";

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
};

interface OrderStore {
  orders: RealOrder[];
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderNumber: number, status: string) => Promise<void>;
}

export const useOrders = create<OrderStore>((set, get) => ({
  orders: [],
  isLoading: false,
  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(
        "https://tecmifood-team-syntax.onrender.com/api/orders",
      );
      const data = await res.json();
      set({ orders: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching orders:", error);
      set({ isLoading: false });
    }
  },
  updateOrderStatus: async (orderNumber, status) => {
    //Actualizamos en la UI localmente primero para que no parezca lenta la app y después se hace el proceso
    set((state) => ({
      orders: state.orders.map((order) =>
        order.orderNumber === orderNumber ? { ...order, status } : order,
      ),
    }));

    try {
      const res = await fetch(
        `https://tecmifood-team-syntax.onrender.com/api/orders/${orderNumber}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      if (!res.ok) {
        throw new Error("No se pudo actualizar en la nube");
      }
    } catch (error) {
      console.error(error);
      //Si falla, se descarga todo de nuevo
      get().fetchOrders();
    }
  },
}));
