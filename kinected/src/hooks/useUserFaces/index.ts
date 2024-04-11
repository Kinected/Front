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

    websocket.onerror = async (err) => {
      const response = await fetch(`http://localhost:8000/api/user/debug`);
      const data = await response.json();
      console.log(data);
      face.updateUser(data.userID);
      console.log("ws err : ", err);
    };

    return () => {
      websocket.close();
    };
  }, []);

  return gestureData;
};
