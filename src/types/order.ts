import { Product } from "../types/product";

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered";

export interface OrderItem {
  product: Product;
  quantity: number;
  modifications: string[];
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Nuevo pedido",
  preparing: "En preparación",
  ready: "Listo para recoger",
  delivered: "Entregado",
};

export const ORDER_STATUS_HINTS: Record<OrderStatus, string> = {
  pending: "La cafetería acaba de recibir tu pedido.",
  preparing: "Están preparando tu pedido.",
  ready: "Ya puedes pasar a recogerlo.",
  delivered: "Este pedido ya fue entregado.",
};

export interface OrderAlert {
  id: string;
  orderId: string;
  orderNumber: number;
  status: OrderStatus;
  title: string;
  body: string;
  createdAt: string;
};
