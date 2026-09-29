/**
 * El backend identifica al cliente con el nombre "Usuario {id}".
 * Todas las pantallas deben usar la misma cadena para no perder pedidos.
 */
export function clientLabel(clientId: string | null | undefined) {
  return `Usuario ${clientId ?? ""}`;
}

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
