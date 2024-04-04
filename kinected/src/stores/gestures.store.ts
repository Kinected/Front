import { create } from "zustand";
import { Deltas } from "@/hooks/useGestures";

type Hand = "left_hand" | "right_hand";
export type Gestures =
  | "no_gesture"
  | "palm"
  | "closed"
  | "victory"
  | "victory_inverted"
  | "point_up"
  | "rock";
export type Swipes =
  | "left"
  | "right"
  | "up"
  | "down"
  | "up-left"
  | "up-right"
  | "down-left"
  | "down-right"
  | "hover_left"
  | "hover_right"
  | "hover_up"
  | "hover_down"
  | "hover_up-left"
  | "hover_up-right"
  | "hover_down-left"
  | "hover_down-right";

type GestureStore = {
  is_listening: boolean;
  hand: Hand | null;
  current_gesture: Gestures | null;
  current_swipe: Swipes | null;
  delta_threshold: number;
  deltas: Deltas;
  actionsOnSwipe: Record<Swipes, () => void>;
  updateIsListening: (isListening: boolean) => void;
  updateHand: (newHand: Hand) => void;
  updateCurrentGesture: (newGesture: Gestures) => void;
  updateCurrentSwipe: (newSwipe: Swipes) => void;
  updateDeltaThreshold: (newThreshold: number) => void;
  updateDeltas: (newDeltas: Deltas) => void;
  updateActionsOnSwipe: (
    newSwipeActions: Partial<Record<Swipes, () => void>>,
  ) => void;
};

const emptyActions: Record<Swipes, () => void> = {
  left: () => {},
  right: () => {},
  up: () => {},
  down: () => {},
  "up-left": () => {},
  "up-right": () => {},
  "down-left": () => {},
  "down-right": () => {},
  hover_left: () => {},
  hover_right: () => {},
  hover_up: () => {},
  hover_down: () => {},
  "hover_up-left": () => {},
  "hover_up-right": () => {},
  "hover_down-left": () => {},
  "hover_down-right": () => {},
};

export const useGesturesStore = create<GestureStore>((set) => ({
  is_listening: false,
  hand: null,
  delta_threshold: 0,
  deltas: { x: 0, y: 0 },
  current_gesture: null,
  current_swipe: null,
  actionsOnSwipe: emptyActions,

  updateIsListening: (isListening) => set({ is_listening: isListening }),
  updateHand: (newHand) => set({ hand: newHand }),
  updateCurrentGesture: (newGesture) => set({ current_gesture: newGesture }),
  updateCurrentSwipe: (newSwipe) => set({ current_swipe: newSwipe }),
  updateDeltaThreshold: (newThreshold) => set({ delta_threshold: newThreshold }),
  updateDeltas: (newDeltas) => set({ deltas: newDeltas }),
  updateActionsOnSwipe: (newSwipeActions) =>
    set({ actionsOnSwipe: { ...emptyActions, ...newSwipeActions } }),
}));