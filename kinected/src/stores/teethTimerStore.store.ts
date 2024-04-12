import { create } from "zustand";

type TeethTimerStore = {
  isRunning: boolean;
  time: number;
  isFinished: boolean;
  updateTime: (value: number) => void;
  updateIsFinished: (value: boolean) => void;
  updateIsRunning: (value: boolean) => void;
  toggleIsRunning: () => void;
};

export const useTeethTimerStore = create<TeethTimerStore>((set) => ({
  // 3 minutes
  time: 10,
  isRunning: false,
  isFinished: false,

  updateTime: (value) => {

    set({
      time: value,
    });
  },

  updateIsFinished: (value) => {
    set({
      isFinished: value,
    });
  },

  updateIsRunning: (value) => {
    set({
      isRunning: value,
    });
  },

  toggleIsRunning: () =>
    set((state) => {
      return {
        isRunning: !state.isRunning,
      };
    }),
}));
