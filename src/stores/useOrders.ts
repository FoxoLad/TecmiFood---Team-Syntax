import { create } from 'zustand';
import { Order, OrderStatus } from '../types/order';

interface OrderStore {
    orders: Order[];
    addOrder: (order: Order) => void;
    updateOrderStatus: (id: string, status: OrderStatus) => void;
}

export const useOrders = create<OrderStore>((set) => ({
    orders: [],
    addOrder: (newOrder) =>
        set((state) => ({ orders: [newOrder, ...state.orders] })),
    updateOrderStatus: (id, status) =>
        set((state) => ({
            orders: state.orders.map((order) =>
                order.id === id ? { ...order, status } : order
            ),
        })),
}));
