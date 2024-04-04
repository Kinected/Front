import { create } from "zustand";

type SensorStore = {
    luminosity: number;
    temperature: number;
    humidity: number;

    updateSensors: (
        luminosity: number,
        temperature: number,
        humidity: number
    ) => void;
};

export const useSensorStore = create<SensorStore>((set) => ({
    luminosity: 0,
    temperature: 0,
    humidity: 0,
    updateSensors: (
        luminosity: number,
        temperature: number,
        humidity: number
    ) => {
        set({
            luminosity,
            temperature,
            humidity,
        });
    },
}));
