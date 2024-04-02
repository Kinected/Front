import {useEffect, useState} from "react";
import {useGesturesStore} from "@/stores/gestures.store";


type Coordinates = number[];

type GestureData = {
  is_listen: boolean;
  hand: "right_hand" | "left_hand";
  gesture: string;
  swipe: string;
  coordinates: {
    face: Coordinates;
    right_hand: Coordinates;
    left_hand: Coordinates;
  }
}


export const useGestures = () => {
  const [gestureData, setGestureData] = useState<GestureData>();

  const gestures = useGesturesStore();

  useEffect(() => {
    const websocket = new WebSocket(`ws:/localhost:8000/ws/swipes`);
    websocket.onopen = () => {
      console.log("Connected to gesture websocket");
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setGestureData(data);
      gestures.updateHand(data.hand);
      gestures.updateCurrentGesture(data.gesture);
      gestures.updateCurrentSwipe(data.swipe);
    };

    websocket.onerror = (err) => {
      console.log("ws err : ", err);
    };

    return () => {
      websocket.close();
    };
  }, []);

  return gestureData;
};