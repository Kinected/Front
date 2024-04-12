import { useState } from "react";
import { useFaceStore } from "@/stores/faces.store";
import useWebSocket from "react-use-websocket";

type FaceData = {
  userID: string;
};

export const useUserFaces = () => {
  const [gestureData, setGestureData] = useState<FaceData>();
  const [isConnected, setIsConnected] = useState(false);

  const face = useFaceStore();

  useWebSocket(`ws:/localhost:8000/ws/faces`, {
    shouldReconnect: () => true,
    onOpen: async () => {
      // console.log("opened");
      // const response = await fetch(`http://localhost:8000/api/user/debug`);
      // const data = await response.json();
      // console.log(data);
      // face.updateUser(data.userID);
    },
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      console.log("ws data : ", data.userID);
      setGestureData(data);
      face.updateUser(data.userID);
    },
    onError: async (event) => {
      console.log("ws err : ", event);
    },
  });

  return gestureData;
};
