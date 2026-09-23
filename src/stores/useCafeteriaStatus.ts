/** Estado compartido de la cafetería. Se guarda en el teléfono y se sincroniza con el API. */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { endpoints } from "../constants/api";

type CafeteriaStatusStore = {
  isOpen: boolean;
  opensAt: string;
  closesAt: string;
  fetchStatus: () => Promise<void>;
  setOpen: (isOpen: boolean) => void;
  setHours: (opensAt: string, closesAt: string) => void;
};

type RemoteStatus = {
  isOpen?: boolean;
  opensAt?: string;
  closesAt?: string;
};

export function maskTime(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

async function pushStatus(status: RemoteStatus) {
  try {
    await fetch(endpoints.cafeteria, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(status),
    });
  } catch (error) {
    console.error("No se pudo publicar el estado de la cafetería:", error);
  }
}

export const useCafeteriaStatus = create<CafeteriaStatusStore>()(
  persist(
    (set, get) => ({
      isOpen: true,
      opensAt: "08:00",
      closesAt: "17:00",
      fetchStatus: async () => {
        try {
          const response = await fetch(endpoints.cafeteria);
          if (!response.ok) {
            return;
          }
          const data: RemoteStatus = await response.json();
          set({
            isOpen: typeof data.isOpen === "boolean" ? data.isOpen : get().isOpen,
            opensAt: data.opensAt && isValidTime(data.opensAt) ? data.opensAt : get().opensAt,
            closesAt: data.closesAt && isValidTime(data.closesAt) ? data.closesAt : get().closesAt,
          });
        } catch (error) {
          console.error("No se pudo leer el estado de la cafetería:", error);
        }
      },
      setOpen: (isOpen) => {
        set({ isOpen });
        pushStatus({ isOpen, opensAt: get().opensAt, closesAt: get().closesAt });
      },
      setHours: (opensAt, closesAt) => {
        if (!isValidTime(opensAt) || !isValidTime(closesAt)) {
          return;
        }
        set({ opensAt, closesAt });
        pushStatus({ isOpen: get().isOpen, opensAt, closesAt });
      },
    }),
    {
      name: "cafeteria-status",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
