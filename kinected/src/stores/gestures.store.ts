import { create } from "zustand";
import { Deltas } from "@/hooks/useUserActions";

type Hand = "left_hand" | "right_hand";

export const VALID_ACTIONS: Actions[] = [
  "click",
  "left",
  "right",
  "up",
  "down",
  "up-left",
  "up-right",
  "down-left",
  "down-right",
] as const;

export type Gestures =
  | "no_gesture"
  | "palm"
  | "closed"
  | "victory"
  | "victory_inverted"
  | "point_up"
  | "rock";
export type Actions =
  | "none"
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
  | "hover_down-right"
  | "click";

type UserActionStore = {
  is_listening: boolean;
  hand: Hand | null;
  current_gesture: Gestures | null;
  current_action: Actions | null;
  delta_threshold: number;
  deltas: Deltas;
  effectOnAction: Record<Actions, () => void>;
  updateIsListening: (isListening: boolean) => void;
  updateHand: (newHand: Hand) => void;
  updateCurrentGesture: (newGesture: Gestures) => void;
  updateCurrentAction: (newAction: Actions) => void;
  updateDeltaThreshold: (newThreshold: number) => void;
  updateDeltas: (newDeltas: Deltas) => void;
  updateEffectsOnAction: (
    newSwipeActions: Partial<Record<Actions, () => void>>,
  ) => void;
};

const emptyActions: Record<Actions, () => void> = {
  none: () => {},
  click: () => {},
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

export const useUserActionsStore = create<UserActionStore>((set) => ({
  is_listening: false,
  hand: null,
  delta_threshold: 0,
  deltas: { x: 0, y: 0 },
  current_gesture: null,
  current_action: null,
  effectOnAction: emptyActions,

  updateIsListening: (isListening) => set({ is_listening: isListening }),
  updateHand: (newHand) => set({ hand: newHand }),
  updateCurrentGesture: (newGesture) => set({ current_gesture: newGesture }),
  updateCurrentAction: (newAction) => set({ current_action: newAction }),
  updateDeltaThreshold: (newThreshold) =>
    set({ delta_threshold: newThreshold }),
  updateDeltas: (newDeltas) => set({ deltas: newDeltas }),
  updateEffectsOnAction: (newEffectsOnActions) => {
    set({
      current_action: null,
      effectOnAction: { ...emptyActions, ...newEffectsOnActions },
    });
  },
}));
