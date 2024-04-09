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
import Meteo from "@/../public/Circle Cloud.svg";
import { useRouter } from "next/navigation";

export default function Weather() {
    const API_KEY = "9e8e78c2678d8180cbc4c164765560c3"; // Correct line
    const router = useRouter();

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

    const WeatherString = (weather: string) => {
        switch (weather) {
            case "Rain":
                return "Pluie";
            case "Clouds":
                return "Nuageux";
            default:
                return "Ensoleillé";
        }
    };

    return (
        // <Button className="origin-top-right">
        //     {WeatherSVG(data.weather[0].main)}
        //     {Math.round(data.main.temp)}°C
        // </Button>
        <div
            onClick={() => router.push("/sensors")}
            className="size-40 rounded-2xl bg-white flex flex-col p-4 justify-between"
        >
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <span className="text-lg">Lille</span>
                    <span className="text-5xl">
                        {Math.round(data.main.temp)}°
                    </span>
                </div>
                {/* <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center"> */}
                <Meteo className="w-12 h-12 -mr-1 -mt-1" />
                {/* </div> */}
            </div>
            <div className="flex justify-between items-end">
                <span className="text-md">
                    {WeatherString(data.weather[0].main)}
                </span>
                <div className="-mb-1">{WeatherSVG(data.weather[0].main)}</div>
            </div>
        </div>
    );
}
