import Button from "@/components/button";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Temperature from "@/../public/Temperature.svg";

type Pos = {
    latitude: number;
    longitude: number;
};

export default function Weather() {
    const [temperature, setTemperature] = useState(0);

    const API_KEY = "9e8e78c2678d8180cbc4c164765560c3"; // Correct line

    function fetchPosition(): Promise<Pos> {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    console.log("Latitude is :", latitude);
                    console.log("Longitude is :", longitude);
                    resolve({
                        latitude,
                        longitude,
                    });
                },
                (error) => reject(error)
            );
        });
    }

    async function fetchTemperature(latitude: number, longitude: number) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

        console.log("Fetching temperature from:", url);
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.main.temp);

        setTemperature(Math.round(data.main.temp));
    }

    useEffect(() => {
        async function fetchData() {
            fetchTemperature(50.633333, 3.066667);
            // const pos = await fetchPosition();
            // fetchTemperature(pos.latitude || 53, pos.longitude || 3);
        }
        fetchData();
    }, []);

    return (
        <Button className="origin-top-right">
            <Temperature className="w-8 h-8" />
            {temperature}°C
        </Button>
    );
}
