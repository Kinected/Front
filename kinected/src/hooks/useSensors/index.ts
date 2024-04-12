import { useState } from "react";
import { useSensorStore } from "@/stores/sensors.store";
import useWebSocket from "react-use-websocket";

type SensorData = {
  userID: string;
};

export const useSensors = () => {
  const [sensorsData, setSensors] = useState<SensorData>();

  const sensors = useSensorStore();

  useWebSocket(`ws:/localhost:8000/ws/sensors`, {
    shouldReconnect: () => true,
    onOpen: () => console.log("opened"),
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      console.log("ws data : ", data);
      setSensors(data);
      sensors.updateSensors(data.luminosity, data.temperature, data.humidity);
    },
    onError: (event) => console.log("error", event),
  });

  return sensorsData;
};
