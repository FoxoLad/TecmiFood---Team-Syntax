/** Tema de la app. El cambio de color espera a que termine la animación del círculo. */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { darkColors, lightColors } from "../constants/theme";

export type ThemeMode = "light" | "dark";

type ThemeStore = {
  mode: ThemeMode;
  animate: boolean;
  phase: "idle" | "expanding";
  target: ThemeMode | null;
  requestMode: (mode: ThemeMode) => void;
  completeTransition: () => void;
  setAnimate: (animate: boolean) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: "light",
      animate: true,
      phase: "idle",
      target: null,
      // Pide cambiar a claro u oscuro. Si la animación está activa, primero crece el círculo
      // y el color real cambia hasta que completeTransition termina.
      requestMode: (mode) => {
        if (get().phase === "expanding" || get().mode === mode) {
          return;
        }
        if (!get().animate) {
          set({ mode, phase: "idle", target: null });
          return;
        }
        set({ phase: "expanding", target: mode });
      },
      // Aplica el tema nuevo cuando la animación del círculo ya cubrió la pantalla.
      completeTransition: () => {
        const target = get().target;
        set(target ? { mode: target, phase: "idle", target: null } : { phase: "idle", target: null });
      },
      // Enciende o apaga la animación del cambio de tema.
      setAnimate: (animate) => set({ animate }),
    }),
    {
      name: "app-theme",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ mode: state.mode, animate: state.animate }),
    },
  ),
);

// Devuelve la paleta clara u oscura según el tema activo. Las pantallas pintan con estos colores.
export function useColors() {
  const mode = useThemeStore((state) => state.mode);
  return mode === "dark" ? darkColors : lightColors;
}
