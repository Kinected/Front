import React, { createContext, ReactNode, useRef } from "react";
import { type StoreApi } from "zustand";
import {
  createTeethTimerStore,
  TeethTimerStore,
} from "@/stores/teethTimer.store";

export const TeethTimerStoreContext =
  createContext<StoreApi<TeethTimerStore> | null>(null);

export interface TeethTimerStoreProviderProps {
  children: ReactNode;
}
export const TeethTimerStoreProvider = ({
  children,
}: TeethTimerStoreProviderProps) => {
  const storeRef = useRef<StoreApi<TeethTimerStore>>();
  if (!storeRef.current) {
    storeRef.current = createTeethTimerStore();
  }

  return (
    <TeethTimerStoreContext.Provider value={storeRef.current}>
      {children}
    </TeethTimerStoreContext.Provider>
  );
};
