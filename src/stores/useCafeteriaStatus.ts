import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { endpoints } from "../constants/api";

export type CafeteriaState = {
  isOpen: boolean;
  opensAt: string;
  closesAt: string;
};

type CafeteriaStatusStore = {
  busters: CafeteriaState;
  beesweet: CafeteriaState;
  fetchStatus: () => Promise<void>;
  setOpen: (key: "busters" | "beesweet", isOpen: boolean) => void;
  setHours: (key: "busters" | "beesweet", opensAt: string, closesAt: string) => void;
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

function computeAutoClose(status: CafeteriaState): CafeteriaState {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const parseMinutes = (time: string) => {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m;
    };
    
    const openMins = parseMinutes(status.opensAt);
    const closeMins = parseMinutes(status.closesAt);
    
    let shouldBeOpen = currentMinutes >= openMins && currentMinutes < closeMins;
    
    if (closeMins < openMins) {
        shouldBeOpen = currentMinutes >= openMins || currentMinutes < closeMins;
    }
    
    if (status.isOpen && !shouldBeOpen) {
        return { ...status, isOpen: false };
    }
    return status;
}

async function pushStatus(key: string, status: Partial<CafeteriaState>) {
  try {
    await fetch(`${endpoints.cafeteria}/${key}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(status),
    });
  } catch (error) {
    console.error("No se pudo publicar el estado de la cafetería:", error);
  }
}

const defaultState: CafeteriaState = { isOpen: true, opensAt: "08:00", closesAt: "17:00" };

export const useCafeteriaStatus = create<CafeteriaStatusStore>()(
  persist(
    (set, get) => ({
      busters: { ...defaultState },
      beesweet: { ...defaultState },
      fetchStatus: async () => {
        try {
          const response = await fetch(endpoints.cafeteria);
          if (!response.ok) return;
          const data = await response.json();
          
          const processData = (key: "busters" | "beesweet", remote: Partial<CafeteriaState> | undefined) => {
              if (!remote) return get()[key];
              const newState = {
                  isOpen: typeof remote.isOpen === "boolean" ? remote.isOpen : get()[key].isOpen,
                  opensAt: remote.opensAt && isValidTime(remote.opensAt) ? remote.opensAt : get()[key].opensAt,
                  closesAt: remote.closesAt && isValidTime(remote.closesAt) ? remote.closesAt : get()[key].closesAt,
              };
              const computed = computeAutoClose(newState);
              if (computed.isOpen !== newState.isOpen) {
                  pushStatus(key, { isOpen: false });
              }
              return computed;
          };

          set({
            busters: processData("busters", data.busters),
            beesweet: processData("beesweet", data.beesweet)
          });
        } catch (error) {
          console.error("No se pudo leer el estado de la cafetería:", error);
        }
      },
      setOpen: (key, isOpen) => {
        set({ [key]: { ...get()[key], isOpen } });
        pushStatus(key, { isOpen, opensAt: get()[key].opensAt, closesAt: get()[key].closesAt });
      },
      setHours: (key, opensAt, closesAt) => {
        if (!isValidTime(opensAt) || !isValidTime(closesAt)) return;
        set({ [key]: { ...get()[key], opensAt, closesAt } });
        pushStatus(key, { isOpen: get()[key].isOpen, opensAt, closesAt });
      },
    }),
    {
      name: "cafeteria-status",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
