// Direcciones del API compartidas con Zustand
export const API_BASE_URL = "https://tecmifood-team-syntax.onrender.com";

export const endpoints = {
  products: `${API_BASE_URL}/api/productos`,
  orders: `${API_BASE_URL}/api/orders`,
  // Arma la URL para cambiar el estado de un pedido: /api/orders/1234/status
  orderStatus: (orderNumber: number) =>
    `${API_BASE_URL}/api/orders/${orderNumber}/status`,
  initUser: `${API_BASE_URL}/api/users/init`,
  cafeteria: `${API_BASE_URL}/api/cafeteria`,
};
