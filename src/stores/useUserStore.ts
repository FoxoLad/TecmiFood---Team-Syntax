import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { endpoints } from "../constants/api";

type UserStore = {
  clientId: string | null;
  isInitialized: boolean;
  notificationsClearedAt: number | null;
  deletedNotificationIds: string[];
  initializeUser: () => Promise<void>;
  clearNotifications: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
};

const CLIENT_ID_KEY = "clientId";
const CLEARED_AT_KEY = "notificationsClearedAt";
const DELETED_NOTIFS_KEY = "deletedNotificationIds";

function createFallbackId() {
  return `#${Math.floor(100000 + Math.random() * 900000)}`;
}

/** Identidad local del cliente. El id se guarda para que sus pedidos sobrevivan al cerrar la app. */
export const useUserStore = create<UserStore>((set, get) => ({
  clientId: null,
  isInitialized: false,
  notificationsClearedAt: null,
  deletedNotificationIds: [],
  initializeUser: async () => {
    try {
      const storedId = await AsyncStorage.getItem(CLIENT_ID_KEY);
      const clearedAtStr = await AsyncStorage.getItem(CLEARED_AT_KEY);
      const notificationsClearedAt = clearedAtStr ? parseInt(clearedAtStr, 10) : null;
      
      const deletedStr = await AsyncStorage.getItem(DELETED_NOTIFS_KEY);
      const deletedNotificationIds = deletedStr ? JSON.parse(deletedStr) : [];

      if (storedId) {
        set({ clientId: storedId, isInitialized: true, notificationsClearedAt, deletedNotificationIds });
        return;
      }

      const res = await fetch(endpoints.initUser, { method: "POST" });
      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
      }

      const data: { clientId?: string } = await res.json();
      const clientId = data.clientId || createFallbackId();
      await AsyncStorage.setItem(CLIENT_ID_KEY, clientId);
      set({ clientId, isInitialized: true, notificationsClearedAt, deletedNotificationIds });
    } catch (error) {
      console.error("Error al inicializar el usuario:", error);
      const clientId = createFallbackId();
      try {
        await AsyncStorage.setItem(CLIENT_ID_KEY, clientId);
      } catch {
        // Sin almacenamiento el id solo vive en esta sesión.
      }
      set({ clientId, isInitialized: true });
    }
  },
  clearNotifications: async () => {
    const now = Date.now();
    await AsyncStorage.setItem(CLEARED_AT_KEY, now.toString());
    await AsyncStorage.setItem(DELETED_NOTIFS_KEY, JSON.stringify([]));
    set({ notificationsClearedAt: now, deletedNotificationIds: [] });
  },
  deleteNotification: async (id: string) => {
    const current = get().deletedNotificationIds;
    if (!current.includes(id)) {
      const updated = [...current, id];
      await AsyncStorage.setItem(DELETED_NOTIFS_KEY, JSON.stringify(updated));
      set({ deletedNotificationIds: updated });
    }
  }
}));
