/** Favoritos persistidos en el dispositivo. Sobreviven al cerrar la app. */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "../types/product";

type FavoritesStore = {
  items: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  removeFavorite: (productId: string) => void;
};

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      // Si el producto ya es favorito, lo quita. Si no, lo agrega. El cambio se guarda en el teléfono.
      toggleFavorite: (product) =>
        set((state) => {
          const alreadyFavorite = state.items.some((item) => item.id === product.id);

          return {
            items: alreadyFavorite
              ? state.items.filter((item) => item.id !== product.id)
              : [...state.items, product],
          };
        }),
      // Responde true si ese producto ya está en la lista de favoritos.
      isFavorite: (productId) => get().items.some((item) => item.id === productId),
      // Borra un favorito por su id, por ejemplo desde la pantalla de favoritos.
      removeFavorite: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);