import { useEffect, useState } from "react";
import { useFaceStore } from "@/stores/faces.store";

type FaceData = {
  userID: string;
};

export const useUserFaces = () => {
  const [gestureData, setGestureData] = useState<FaceData>();
  const [isConnected, setIsConnected] = useState(false);

  const face = useFaceStore();

  useEffect(() => {
    if (isConnected) return;
    const websocket = new WebSocket(`ws:/localhost:8000/ws/faces`);
    websocket.onopen = () => {
      console.log("Connected to face websocket");
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("ws data : ", data.userID);
      setGestureData(data);
      face.updateUser(data.userID);
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
