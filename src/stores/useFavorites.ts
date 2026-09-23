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
      toggleFavorite: (product) =>
        set((state) => {
          const alreadyFavorite = state.items.some((item) => item.id === product.id);

          return {
            items: alreadyFavorite
              ? state.items.filter((item) => item.id !== product.id)
              : [...state.items, product],
          };
        }),
      isFavorite: (productId) => get().items.some((item) => item.id === productId),
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