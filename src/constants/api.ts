/** Direcciones del API compartidas por las tiendas de Zustand. */
export const API_BASE_URL = "https://tecmifood-team-syntax.onrender.com";

export const endpoints = {
  products: `${API_BASE_URL}/api/productos`,
  orders: `${API_BASE_URL}/api/orders`,
  orderStatus: (orderNumber: number) =>
    `${API_BASE_URL}/api/orders/${orderNumber}/status`,
  initUser: `${API_BASE_URL}/api/users/init`,
  cafeteria: `${API_BASE_URL}/api/cafeteria`,
};
