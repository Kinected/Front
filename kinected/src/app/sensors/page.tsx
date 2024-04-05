"use client";
import { useSensorStore } from "@/stores/sensors.store";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export default function SensorsPage() {
    const temperature = useSensorStore((state) => state.temperature);
    const humidity = useSensorStore((state) => state.humidity);
    const luminosity = useSensorStore((state) => state.luminosity);

    return (
        <AnimatePresence>
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3 } }}
                exit={{ opacity: 0 }}
                className="flex h-full w-full flex-col gap-4 items-center justify-center"
            >
                <span className="text-white font-medium">
                    Temperature: {temperature}°C
                </span>
                <span className="text-white font-medium">
                    Humidité: {humidity}
                </span>
                <span className="text-white font-medium">
                    Luminosité: {luminosity} lux
                </span>
            </motion.main>
        </AnimatePresence>
    );
}
