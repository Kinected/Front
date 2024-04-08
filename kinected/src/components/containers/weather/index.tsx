import Button from "@/components/button";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import Temperature from "@/../public/Temperature.svg";
import Rain from "@/../public/Cloud Rain.svg";
import Clouds from "@/../public/Clouds.svg";
import Sun from "@/../public/Sun.svg";
import { useQuery } from "react-query";
import { ActualWeather } from "@/types/weather";

export default function Weather() {
    const API_KEY = "9e8e78c2678d8180cbc4c164765560c3"; // Correct line

    const { data } = useQuery<ActualWeather>(
        ["weather", "actual"],
        async () => {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=Lille&appid=${API_KEY}&units=metric`
            );
            return await response.json();
        },
        { refetchInterval: 1000 * 60 * 10 }
    );

    if (!data) return;

    const WeatherSVG = (weather: string) => {
        switch (weather) {
            case "Rain":
                return <Rain className="w-8 h-8" />;
            case "Clouds":
                return <Clouds className="w-8 h-8" />;
            default:
                return <Sun className="w-8 h-8" />;
        }
    };

    return (
        <Button className="origin-top-right">
            {WeatherSVG(data.weather[0].main)}
            {Math.round(data.main.temp)}°C
        </Button>
    );
}
