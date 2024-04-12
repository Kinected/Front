"use client";
import { useSensorStore } from "@/stores/sensors.store";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { nanoid } from "nanoid";
import { ActualWeather, DailyWeather, WeatherData } from "@/types/weather";

import Rain from "../../icons/Cloud Rain.svg";
import Clouds from "../../icons/Clouds.svg";
import Sun from "../../icons/Sun.svg";
import Calendar from "../../icons/Calendar.svg";
import Arrow from "../../icons/Arrow - Up.svg";
import { useUserActionsStore } from "@/stores/gestures.store";
import { useRouter } from "next/navigation";

export default function SensorsPage() {
  const temperature = useSensorStore((state) => state.temperature);
  const humidity = useSensorStore((state) => state.humidity);
  const luminosity = useSensorStore((state) => state.luminosity);
  const router = useRouter();

  const API_KEY = "9e8e78c2678d8180cbc4c164765560c3"; // Correct line

  const updateActionsOnSwipe = useUserActionsStore(
    (state) => state.updateEffectsOnAction,
  );

  useEffect(() => {
    updateActionsOnSwipe({
      up: () => router.push("/"),
      click: () => console.log("click"),
    });
  }, []);

  const { data: weatherData } = useQuery<WeatherData>("weather", async () => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=Lille&units=metric&appid=${API_KEY}`,
    );
    return await response.json();
  });

  const { data: actualWeather } = useQuery<ActualWeather>(
    ["weather", "actual"],
    async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Lille&appid=${API_KEY}&units=metric`,
      );
      return await response.json();
    },
    { refetchInterval: 1000 * 60 * 10 },
  );

  if (!weatherData || !actualWeather) return;
  console.log(weatherData);

  const dailyWeather = [] as DailyWeather[];
  let meanTemp = 0;
  let minTemp = weatherData.list[0].main.temp_min;
  let maxTemp = weatherData.list[0].main.temp_max;
  let lastdate = weatherData.list[0].dt_txt.split(" ")[0];
  let index = 0;

  let nbClear = 0;
  let nbRain = 0;
  let nbClouds = 0;

  weatherData.list.forEach((item) => {
    console.log(item.weather[0].main);
    if (item.dt_txt.split(" ")[0] === lastdate) {
      meanTemp += item.main.temp;
      if (item.main.temp_min > minTemp) minTemp = item.main.temp_min;
      if (item.main.temp_max < maxTemp) maxTemp = item.main.temp_max;
      switch (item.weather[0].main) {
        case "Rain":
          nbRain++;
          break;
        case "Clouds":
          nbClouds++;
          break;
        default:
          nbClear++;
          break;
      }
      index++;
    } else {
      dailyWeather.push({
        date: lastdate,
        temp: meanTemp / index,
        maxTemp: maxTemp,
        minTemp: minTemp,
        weather:
          nbClear > nbRain && nbClear > nbClouds
            ? "Clear"
            : nbRain > nbClouds
              ? "Rain"
              : "Clouds",
      });
      minTemp = item.main.temp_min;
      maxTemp = item.main.temp_max;
      meanTemp = 0;
      index = 0;
      lastdate = item.dt_txt.split(" ")[0];
    }
  });

  console.log(dailyWeather);

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
    <AnimatePresence>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.3 } }}
        exit={{ opacity: 0 }}
        className="flex h-full w-full flex-col gap-4 items-center justify-center"
      >
        <div className="w-3/4 flex flex-col bg-white p-4 rounded-2xl gap-8 ">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-2xl">Lille</span>
              <span className="text-6xl">
                {Math.round(actualWeather.main.temp)}°
              </span>
            </div>
            <div className="flex flex-col items-end">
              {WeatherSVG(actualWeather.weather[0].main)}
              <span className="text-xl text-end">
                {WeatherString(actualWeather.weather[0].main)}
              </span>
            </div>
          </div>
          <div className="w-full h-20 rounded-xl flex justify-between gap-4">
            {weatherData.list.slice(1, 9).map((item) => {
              const date = new Date(item.dt_txt);
              const hours = date.getHours();
              const minutes = date.getMinutes();
              return (
                <div
                  key={nanoid()}
                  className="flex-1 rounded-xl flex flex-col justify-between items-center"
                >
                  <span className="text-sm font-light">{`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`}</span>
                  {WeatherSVG(item.weather[0].main)}

                  <span className="text-md">{Math.round(item.main.temp)}°</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-3/4 flex gap-4 flex-wrap">
          <div className="flex flex-1 bg-white p-4 rounded-2xl flex-col gap-8 pb-8">
            <div className="flex gap-2 items-center">
              <Calendar className="w-8 h-8" />
              <span className="text-xl"> Prochains jours</span>
            </div>
            <div className="flex flex-col gap-4">
              {dailyWeather.map((item) => {
                const forecastDate = new Date(item.date);
                const today = new Date();
                const isToday =
                  forecastDate.getDate() === today.getDate() &&
                  forecastDate.getMonth() === today.getMonth() &&
                  forecastDate.getFullYear() === today.getFullYear();

                const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
                const day = isToday ? "Auj" : days[forecastDate.getDay()];

                return (
                  <div key={nanoid()} className="flex flex-col gap-2">
                    <div className="w-full h-0.5 bg-black rounded-xl " />
                    <div className="flex gap-2 items-center flex-[1] justify-between">
                      <span className="flex-1 text-lg font-medium">{day}</span>
                      <div className="flex-1">
                        <Clouds className="w-8 h-8" />
                      </div>
                      <span className="text-xl flex-1 font-medium">
                        {Math.round(item.temp)}°
                      </span>
                      <div className="flex flex-1 items-center">
                        <Arrow className="w-4 h-4" />
                        <span className="text-md">
                          {Math.round(item.maxTemp)}°
                        </span>
                      </div>
                      <div className="flex flex-1 items-center">
                        <Arrow className="w-4 h-4 rotate-180" />
                        <span className="text-md">
                          {Math.round(item.minTemp)}°
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex flex-1 bg-white p-4 rounded-2xl justify-between">
              <div className="flex flex-col">
                <span className="text-xl">
                  Humidité <span className="text-sm font-light">(g/m3)</span>
                </span>
                <span className="text-xs font-light">Interieur</span>
              </div>
              <div className="flex flex-col justify-end items-end">
                <span className="text-5xl">{humidity} g/m3</span>
              </div>
            </div>
            <div className="flex flex-1 bg-white p-4 rounded-2xl justify-between">
              <div className="flex flex-col justify-between">
                <div className="flex flex-col">
                  <span className="text-xl">
                    Temperature <span className="text-sm font-light">(°C)</span>
                  </span>
                  <span className="text-xs font-light">Interieur</span>
                </div>
              </div>
              <div className="flex flex-col justify-end items-end">
                <span className="text-5xl">{temperature}°C</span>
              </div>
            </div>
            <div className="flex flex-1 bg-white p-4 rounded-2xl justify-between">
              <div className="flex flex-col">
                <span className="text-xl">
                  Luminosité <span className="text-sm font-light">(lux)</span>
                </span>
                <span className="text-xs font-light">Interieur</span>
              </div>
              <div className="flex flex-col justify-end items-end">
                <span className="text-5xl">{luminosity} lux</span>
              </div>
            </div>
          </div>
        </div>
        {/* <span className="text-white font-medium">
                    Temperature: {temperature}°C
                </span>
                <span className="text-white font-medium">
                    Humidité: {humidity}
                </span>
                <span className="text-white font-medium">
                    Luminosité: {luminosity} lux
                </span> */}
      </motion.main>
    </AnimatePresence>
  );
}
