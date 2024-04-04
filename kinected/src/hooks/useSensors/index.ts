import { useEffect, useState } from "react";
import { useSensorStore } from "@/stores/sensors.store";

type SensorData = {
    userID: string;
};

export const useSensors = () => {
    const [sensorsData, setSensors] = useState<SensorData>();

    const sensors = useSensorStore();

    useEffect(() => {
        const websocket = new WebSocket(`ws:/localhost:8000/ws/sensors`);
        websocket.onopen = () => {
            console.log("Connected to gesture websocket");
        };

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("ws data : ", data);
            setSensors(data);
            sensors.updateSensors(
                data.luminosity,
                data.temperature,
                data.humidity
            );
        };

        websocket.onerror = (err) => {
            console.log("ws err : ", err);
        };

        return () => {
            websocket.close();
        };
    }, []);

    return sensorsData;
};
