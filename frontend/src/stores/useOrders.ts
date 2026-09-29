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
  fetchOrders: (background?: boolean) => Promise<void>;
  rememberOrder: (order: RealOrder) => void;
  updateOrderStatus: (orderNumber: number, status: string) => Promise<void>;
  deleteOrder: (orderNumber: number) => Promise<void>;
}

// Comprueba que lo que llegó del servidor sí es un pedido: tiene número y una lista de productos.
// Evita guardar en memoria una respuesta vacía o un mensaje de error.
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
  // Pide al servidor la lista completa de pedidos y la deja en memoria.
  // Si background es true, actualiza en silencio, sin mostrar el indicador de carga.
  fetchOrders: async (background = false) => {
    if (!background) set({ isLoading: true });
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
  // Mete un pedido recién creado al inicio de la lista, sin esperar el siguiente refresco.
  // Si ya estaba, lo reemplaza para no duplicarlo.
  rememberOrder: (order) => {
    set((state) => ({
      orders: [order, ...state.orders.filter((current) => current._id !== order._id)],
    }));
  },
  
  // Quita el pedido de la pantalla al instante y luego lo borra en el servidor.
  // Si el servidor falla, vuelve a mostrar la lista como estaba.
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
  // Cambia el estado en pantalla de inmediato y lo confirma con PATCH al servidor.
  // Si el servidor lo rechaza, restaura el estado anterior y vuelve a descargar los pedidos.
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


