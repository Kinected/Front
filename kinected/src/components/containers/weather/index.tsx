import React from "react";
import Button from "../../button"; // Assuming Button is a custom component
import { useEffect, useState } from "react";

export default function Weather() {
    const API_KEY = "9e8e78c2678d8180cbc4c164765560c3"; // Correct line
    const [temperature, setTemperature] = useState<number | null>(null);

    // Function to fetch and update temperature
    function fetchPosition() {
        return;
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log("Latitude is :", latitude);
            console.log("Longitude is :", longitude);

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}}&lon=${longitude}&appid=${API_KEY}&units=metric`;

            console.log("Fetching temperature from:", url);
            const response = await fetch(url);
            const data = await response.json();

            console.log(data);
            console.log(data.main.temp);
            if (data) setTemperature(Math.round(data.main.temp));
        });
    }

    useEffect(() => {
        // fetchPosition();
    }, []);

    return (
        <Button className="origin-top-right" onClick={fetchPosition}>
            {/* {temperature} */}26°C
        </Button>
    );
}
