import { createStore, useStore } from "zustand";
import { useContext } from "react";
import { TeethTimerStoreContext } from "@/components/provider/timer";

type TeethTimerState = {
  time: number;
  interval: null | NodeJS.Timeout;
  isRunning: boolean;
  isFinished: boolean;
};

type TeethTimerActions = {
  updateTime: (value: number) => void;
  resetTime: () => void;
  updateIsFinished: (value: boolean) => void;
  toggleIsRunning: () => void;
  formatTime: (time: number) => string;
};

export type TeethTimerStore = TeethTimerActions & TeethTimerState;

const DEFAULT_TIME = 180;

export const defaultInitState: TeethTimerState = {
  // 3 minutes
  time: DEFAULT_TIME,
  interval: null,
  isRunning: false,
  isFinished: false,
};

export const createTeethTimerStore = (
  initState: TeethTimerState = defaultInitState,
) => {
  return createStore<TeethTimerStore>()((set) => ({
    ...initState,

    updateTime: (value) => {
      set({
        time: value,
      });
    },

    formatTime: (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;

      return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    },

    resetTime: () => {
      set((state) => {
        if (state.interval) clearInterval(state.interval);

        return {
          time: defaultInitState.time,
          interval: null,
          isRunning: false,
          isFinished: false,
        };
      });
    },

    updateIsFinished: (value) => {
      set({
        isFinished: value,
      });
    },

    toggleIsRunning: () => {
      set((state) => {
        if (state.isRunning || state.isFinished) {
          if (state.interval) clearInterval(state.interval!);

          if (state.isFinished) {
            return {
              ...state,
              interval: null,
              time: defaultInitState.time,
              isFinished: false,
              isRunning: false,
            };
          }

          return {
            ...state,
            interval: null,
            isFinished: false,
            isRunning: false,
          };
        }

        return {
          interval: setInterval(() => {
            set((state) => {
              if (state.time === 0) {
                clearInterval(state.interval!);
                return {
                  ...state,
                  isRunning: false,
                  isFinished: true,
                };
              }

              return {
                ...state,
                time: state.time - 1,
              };
            });
          }, 1000),
          isRunning: true,
          isFinished: false,
        };
      });
    },
  }));
};

export const useTeethTimerStore = <T>(
  selector: (store: TeethTimerStore) => T,
): T => {
  const counterStoreContext = useContext(TeethTimerStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be use within CounterStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};
