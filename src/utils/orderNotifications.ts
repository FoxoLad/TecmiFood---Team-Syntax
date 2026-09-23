/** Textos de aviso para los estados en inglés. La app en producción usa los estados en español de `types/order`. */
import type { OrderStatus } from "../types/order";

export const ORDER_NOTIFICATIONS: Record<OrderStatus, { title: string; body: (orderNumber: number) => string }> = {
  pending: {
    title: "Pedido recibido",
    body: (orderNumber) => `Tu pedido #${pad(orderNumber)} ya está en cocina.`,
  },
  preparing: {
    title: "En preparación",
    body: (orderNumber) => `Estamos preparando tu pedido #${pad(orderNumber)}.`,
  },
  ready: {
    title: "Listo para recoger",
    body: (orderNumber) => `Ya puedes recoger tu pedido #${pad(orderNumber)}.`,
  },
  delivered: {
    title: "Pedido entregado",
    body: (orderNumber) => `Recogiste el pedido #${pad(orderNumber)}. ¡Buen provecho!`,
  },
};

function pad(orderNumber: number) {
  return String(orderNumber).padStart(3, "0");
}
