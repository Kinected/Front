"use client";
import React from "react";
import { useFaceStore } from "@/stores/faces.store";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import { nanoid } from "nanoid";
import { BusData, VlilleData } from "@/types/ilevia";
import { Line } from "@/components/widgets/Ilevia/Bus";

export default function Ilevia() {
  const userID = useFaceStore((state) => state.userID);

  const { data: busData } = useQuery<BusData[]>(
    ["bus", userID],
    async () => {
      const response = await fetch(
        `http://localhost:8000/api/ilevia/arret?userID=${userID}`,
      );
      return await response.json();
    },
    {
      refetchInterval: 1000 * 60,
    },
  );

  const { data: vlilleData } = useQuery<VlilleData[]>(
    ["vlille", userID],
    async () => {
      const response = await fetch(
        `http://localhost:8000/api/ilevia/borne?userID=${userID}`,
      );
      return await response.json();
    },
    {
      refetchInterval: 1000 * 60,
    },
  );

  if (!busData || !vlilleData) return;

  return (
    <AnimatePresence>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.3 } }}
        exit={{ opacity: 0 }}
        className="flex h-full w-full flex-col gap-4 items-center justify-center"
      >
        <div className={"w-3/4 flex gap-8"}>
          <div className={"flex flex-1 flex-col gap-8"}>
            <div className="flex flex-1 flex-col gap-4 bg-white p-4 rounded-2xl">
              <span className={"text-2xl"}>Prochains bus</span>
              {busData.map((station) => {
                const stationName = Object.keys(station)[0];
                const lines = Object.keys(station[stationName]);
                return (
                  <div key={nanoid()} className={"flex flex-col gap-2"}>
                    <div className={"flex justify-between gap-4 items-center"}>
                      <span className={"text-lg font-light"}>
                        {Object.keys(station)[0].split("")[0] +
                          Object.keys(station)[0].slice(1).toLowerCase()}
                      </span>
                    </div>

                    <div className={"flex flex-col gap-2"}>
                      {lines.map((line) => {
                        const directions = Object.keys(
                          station[stationName][line],
                        );
                        return (
                          <div key={nanoid()} className={"flex flex-col gap-2"}>
                            {directions.map((direction) => {
                              // get in how much time the bus will be there
                              const bus = station[stationName][line][direction];
                              const minutes = bus.map((b) => {
                                const now = new Date();
                                const date = new Date(b.heureestimeedepart);
                                const diff = date.getTime() - now.getTime();
                                if (diff < 0) return "0";
                                return Math.floor(diff / 60000).toString();
                              });

                              return (
                                <div
                                  key={nanoid()}
                                  className={"flex flex-col gap-2"}
                                >
                                  <div
                                    className={"border-b-2 border-gray-200"}
                                  />
                                  <Line
                                    line={line}
                                    destination={direction}
                                    time={minutes}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={"flex flex-col gap-8 flex-1"}>
            <div
              key={nanoid()}
              className="flex flex-1 flex-col gap-4 bg-white p-4 rounded-2xl"
            >
              <span className={"text-2xl"}>Stations V'Lille</span>
              {vlilleData.map((borne) => (
                <div key={nanoid()} className={"flex flex-col gap-2"}>
                  <span className={"text-lg font-light"}>
                    {borne.name.split("")[0] +
                      borne.name.slice(1).toLowerCase()}
                  </span>
                  <div className={"border-b-2 border-gray-200"} />
                  <div className={"flex justify-between items-center"}>
                    <span className={"text-md font-light"}>
                      Places disponibles
                    </span>
                    <span className={"text-gray-500 font-light"}>
                      {borne.nbPlacesDispo}
                    </span>
                  </div>
                  <div className={"flex justify-between items-center"}>
                    <span className={"text-md font-light"}>
                      Velos disponibles
                    </span>
                    <span className={"text-gray-500 font-light"}>
                      {borne.nbVelosDispo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.main>
    </AnimatePresence>
  );
}
