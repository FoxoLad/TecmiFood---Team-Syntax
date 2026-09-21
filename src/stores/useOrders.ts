import { create } from "zustand";
import { Order, OrderAlert, OrderStatus } from "../types/order";
import { ORDER_NOTIFICATIONS } from "../utils/orderNotifications";

type NewOrder = Omit<Order, "id" | "orderNumber" | "createdAt" | "status"> & {
  status?: OrderStatus;
};

interface OrderStore {
  orders: Order[];
  alerts: OrderAlert[];
  addOrder: (order: NewOrder) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

function createAlert(order: Pick<Order, "id" | "orderNumber">, status: OrderStatus): OrderAlert {
  const message = ORDER_NOTIFICATIONS[status];

  return {
    id: `alert-${order.id}-${status}-${Date.now()}`,
    orderId: order.id,
    orderNumber: order.orderNumber,
    status,
    title: message.title,
    body: message.body(order.orderNumber),
    createdAt: new Date().toISOString(),
  };
}

export const useOrders = create<OrderStore>((set, get) => ({
  orders: [],
  alerts: [],
  addOrder: (newOrder) => {
    const orderNumber =
      get().orders.reduce((highest, order) => Math.max(highest, order.orderNumber), 0) + 1;
    const order: Order = {
      ...newOrder,
      id: `order-${Date.now()}-${orderNumber}`,
      orderNumber,
      status: newOrder.status ?? "pending",
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      orders: [order, ...state.orders],
      alerts: [createAlert(order, order.status), ...state.alerts],
    }));
    return order;
  },
  updateOrderStatus: (id, status) => {
    const current = get().orders.find((order) => order.id === id);
    if (!current || current.status === status) {
      return;
    }

    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, status } : order,
      ),
      alerts: [createAlert(current, status), ...state.alerts],
    }));
  },
}));
