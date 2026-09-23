import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

type UserStore = {
  clientId: string | null;
  isInitialized: boolean;
  notificationsClearedAt: number | null;
  initializeUser: () => Promise<void>;
  clearNotifications: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  clientId: null,
  isInitialized: false,
  notificationsClearedAt: null,
  initializeUser: async () => {
    try {
      const storedId = await AsyncStorage.getItem("clientId");
      const clearedAtStr = await AsyncStorage.getItem("notificationsClearedAt");
      const notificationsClearedAt = clearedAtStr ? parseInt(clearedAtStr, 10) : null;

      if (storedId) {
        set({ clientId: storedId, isInitialized: true, notificationsClearedAt });
        return;
      }

      const res = await fetch(
        "https://tecmifood-team-syntax.onrender.com/api/users/init",
        {
          method: "POST",
        },
      );
      const data = await res.json();

      if (data.clientId) {
        await AsyncStorage.setItem("clientId", data.clientId);
        set({ clientId: data.clientId, isInitialized: true, notificationsClearedAt });
      }
    } catch (error) {
      console.error("Error al inicializar el usuario:", error);
      set({
        clientId: "#" + Math.floor(100000 + Math.random() * 900000),
        isInitialized: true,
      });
    }
  },
  clearNotifications: async () => {
    const now = Date.now();
    await AsyncStorage.setItem("notificationsClearedAt", now.toString());
    set({ notificationsClearedAt: now });
  }
}));
