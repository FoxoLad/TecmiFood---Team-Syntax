/**
 * El backend identifica al cliente con el nombre "Usuario {id}".
 * Todas las pantallas deben usar la misma cadena para no perder pedidos.
 */
// Arma el nombre con el que el pedido queda ligado a este teléfono: "Usuario #000042".
export function clientLabel(clientId: string | null | undefined) {
  return `Usuario ${clientId ?? ""}`;
}

// Dice si un pedido es de este cliente comparando el nombre guardado con "Usuario {su id}".
export function isClientOrder(
  customerName: string,
  clientId: string | null | undefined,
) {
  return Boolean(clientId) && customerName === clientLabel(clientId);
}

/** Un aviso sigue visible si llegó después de la última vez que el usuario los limpió. */
export function isAlertVisible(updatedAt: string, clearedAt: number | null) {
  if (!clearedAt) {
    return true;
  }

  const time = new Date(updatedAt).getTime();
  return !Number.isNaN(time) && time > clearedAt;
}
