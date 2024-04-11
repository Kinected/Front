import { create } from "zustand";

type TeethTimerStore = {
  isRunning: boolean;
  time: number;
  updateTime: (value: number) => void;
  updateIsRunning: (value: boolean) => void;
  toggleIsRunning: () => void;
};

export const useTeethTimerStore = create<TeethTimerStore>((set) => ({
  // 3 minutes
  isRunning: false,
  time: 180,

  updateTime: (value) => {
    set({
      time: value,
    });
  },

  updateIsRunning: (value) => {
    set({
      isRunning: value,
    });
  },

  toggleIsRunning: () => {
    set((state) => {
      return {
        isRunning: !state.isRunning,
      };
    });
  },
}));
