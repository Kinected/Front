import React from "react";
import Rain from "@/icons/Apps/Weather/Cloud Rain.svg";
import Clouds from "@/icons/Apps/Weather/Clouds.svg";
import Sun from "@/icons/Apps/Weather/Sun.svg";
import { useQuery } from "react-query";
import { ActualWeather } from "@/types/weather";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

type Props = {
  isHover: boolean;
};
export default function Weather(props: Props) {
  const API_KEY = "9e8e78c2678d8180cbc4c164765560c3"; // Correct line
  const router = useRouter();

  const { data } = useQuery<ActualWeather>(
    ["weather", "actual"],
    async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Lille&appid=${API_KEY}&units=metric`,
      );
      return await response.json();
    },
    { refetchInterval: 1000 * 60 * 10 },
  );

  if (!data) return;

  const WeatherSVG = (weather: string) => {
    switch (weather) {
      case "Rain":
        return <Rain className="size-12" />;
      case "Clouds":
        return <Clouds className="size-12" />;
      default:
        return <Sun className="size-12" />;
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => router.push("/sensors")}
      className={twMerge(
        "size-48 rounded-3xl bg-white flex flex-col p-4 justify-between relative origin-top-right transition-all duration-500",
        "ring-white/60",
        props.isHover && "scale-110 ring-10",
      )}
    >
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span className="text-lg">Lille</span>
          <span className="text-5xl">{Math.round(data.main.temp)}°C</span>
        </div>
        {/* <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center"> */}
        <div className="-mt-1 -ml-1">{WeatherSVG(data.weather[0].main)}</div>
        {/* </div> */}
      </div>
      <div className="flex justify-between items-end">
        <span className="text-md">{WeatherString(data.weather[0].main)}</span>
      </div>
    </motion.div>
  );
}
