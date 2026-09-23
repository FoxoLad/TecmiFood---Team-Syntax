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

export const ORDER_STATUS_LABELS: Record<string, string> = {
  "Pendiente": "Nuevo pedido",
  "En preparación": "En preparación",
  "Terminado": "Listo para recoger",
  "Entregado": "Entregado",
  "Cancelado": "Cancelado",
};

export const ORDER_STATUS_HINTS: Record<string, string> = {
  "Pendiente": "La cafetería acaba de recibir tu pedido.",
  "En preparación": "Están preparando tu pedido.",
  "Terminado": "Ya puedes pasar a recoger tu pedido.",
  "Entregado": "Este pedido ya fue entregado.",
  "Cancelado": "Este pedido ha sido cancelado.",
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
