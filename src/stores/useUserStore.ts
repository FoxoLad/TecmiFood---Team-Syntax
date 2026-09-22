import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

type UserStore = {
  clientId: string | null;
  isInitialized: boolean;
  initializeUser: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  clientId: null,
  isInitialized: false,
  initializeUser: async () => {
    try {
      //1.- Revisar si ya hay un ID guardado en el dispositivo
      const storedId = await AsyncStorage.getItem("clientId");

      if (storedId) {
        set({ clientId: storedId, isInitialized: true });
        return;
      }

      //2.- Si es la primera vez que se abre la app, se pide un ID nuevo al backend
      const res = await fetch(
        "https://tecmifood-team-syntax.onrender.com/api/users/init",
        {
          method: "POST",
        },
      );
      const data = await res.json();

      if (data.clientId) {
        await AsyncStorage.setItem("clientId", data.clientId);
        set({ clientId: data.clientId, isInitialized: true });
      }
    } catch (error) {
      console.error("Error al inicializar el usuario:", error);
      //En caso de error de red se crea un ID temporal
      set({
        clientId: "#" + Math.floor(100000 + Math.random() * 900000),
        isInitialized: true,
      });
    }
  },
}));
