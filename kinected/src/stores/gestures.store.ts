import { create } from "zustand";

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
  | "top"
  | "bottom"
  | "up-left"
  | "up-right"
  | "bottom-left"
  | "bottom-right"
  | "hover_left"
  | "hover_right"
  | "hover_top"
  | "hover_bottom"
  | "hover_up-left"
  | "hover_up-right"
  | "hover_bottom-left"
  | "hover_bottom-right";

type GestureStore = {
  is_listening: boolean;
  hand: Hand | null;
  current_gesture: Gestures | null;
  current_swipe: Swipes | null;
  actionsOnSwipe: Record<Swipes, () => void>;
  updateIsListening: (isListening: boolean) => void;
  updateHand: (newHand: Hand) => void;
  updateCurrentGesture: (newGesture: Gestures) => void;
  updateCurrentSwipe: (newSwipe: Swipes) => void;
  updateActionsOnSwipe: (
    newSwipeActions: Partial<Record<Swipes, () => void>>,
  ) => void;
};

const emptyActions: Record<Swipes, () => void> = {
  left: () => {},
  right: () => {},
  top: () => {},
  bottom: () => {},
  "up-left": () => {},
  "up-right": () => {},
  "bottom-left": () => {},
  "bottom-right": () => {},
  hover_left: () => {},
  hover_right: () => {},
  hover_top: () => {},
  hover_bottom: () => {},
  "hover_up-left": () => {},
  "hover_up-right": () => {},
  "hover_bottom-left": () => {},
  "hover_bottom-right": () => {},
};

export const useGesturesStore = create<GestureStore>((set) => ({
  is_listening: false,
  hand: null,
  current_gesture: null,
  current_swipe: null,
  actionsOnSwipe: emptyActions,

  updateIsListening: (isListening) => set({ is_listening: isListening }),
  updateHand: (newHand) => set({ hand: newHand }),
  updateCurrentGesture: (newGesture) => set({ current_gesture: newGesture }),
  updateCurrentSwipe: (newSwipe) => set({ current_swipe: newSwipe }),
  updateActionsOnSwipe: (newSwipeActions) =>
    set({ actionsOnSwipe: { ...emptyActions, ...newSwipeActions } }),
}));