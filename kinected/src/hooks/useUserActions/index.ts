import { useState } from "react";
import { useUserActionsStore } from "@/stores/gestures.store";
import useWebSocket from "react-use-websocket";

type Coordinates = number[];

export type Deltas = {
  x: number;
  y: number;
};

type GestureData = {
  is_listen: boolean;
  hand: "right_hand" | "left_hand";
  gesture: string;
  action: string;
  deltas: Deltas;
  coordinates: {
    face: Coordinates;
    right_hand: Coordinates;
    left_hand: Coordinates;
  };
};

const WEBSOCKET_URL = "ws://localhost:8000/ws/swipes";

export const useUserActions = () => {
  const [gestureData, setGestureData] = useState<GestureData>();

  const gestures = useUserActionsStore();

  useWebSocket(WEBSOCKET_URL, {
    shouldReconnect: () => true,
    onOpen: () => console.log("opened"),
    onMessage: (event) => {
      const data = JSON.parse(event.data);

      if (data.action && data.action === "none") {
        console.log("action", data.action);
      }
      setGestureData(data);
      gestures.updateDeltas(data.deltas);
      gestures.updateHand(data.hand);
      gestures.updateDeltas(data.deltas);
      gestures.updateCurrentGesture(data.gesture);
      gestures.updateCurrentAction(data.action);
    },
    onError: (event) => console.log("error", event),
  });

  return gestureData;
};
