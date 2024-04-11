import { motion } from "framer-motion";
import React from "react";
import { twMerge } from "tailwind-merge";
import Ilevia from "@/icons/Ilevia.svg";
import Bus from "@/icons/Bus front.svg";
import { nanoid } from "nanoid";
import { useFaceStore } from "@/stores/faces.store";
import { useQuery } from "react-query";
import { BusData } from "@/types/ilevia";

type Props = {
  isHover: boolean;
};

export default function IleviaBusWidget(props: Props) {
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

  if (!busData) return;

  const station = busData[0];
  const stationName = Object.keys(station)[0];
  const lines = Object.keys(station[stationName]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.3 } }}
      exit={{ opacity: 0 }}
      className={twMerge(
        "min-w-64 p-3 bg-white rounded-2xl flex flex-col gap-2",
        "origin-bottom-right transition-all duration-500 relative",
        "after:absolute after:top-0 after:left-0 after:-z-10",
        "after:bg-white after:rounded-2xl",
        "after:transition-all after:duration-500",
        "after:w-full after:h-full",
        props.isHover &&
          "scale-110 after:opacity-40 after:rounded-2xl after:outline after:outline-offset-0 after:outline-8 after:outline-white -translate-y-1 -translate-x-1",
      )}
    >
      <div className={"flex justify-between gap-4 items-center"}>
        <Ilevia className="w-10 h-10 rounded-xl" />
        <span className={"text-lg font-medium"}>
          {stationName.split("")[0] + stationName.slice(1).toLowerCase()}
        </span>
      </div>

      <div className={"flex flex-col gap-2"}>
        {lines.map((line) => {
          const directions = Object.keys(station[stationName][line]);
          return (
            <div key={nanoid()} className={"flex flex-col gap-1"}>
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
                  <div key={nanoid()} className={"flex flex-col gap-1"}>
                    <div className={"border-b-2 border-gray-200"} />
                    <Line line={line} destination={direction} time={minutes} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

type LineProps = {
  line: string;
  destination: string;
  time: string[];
};
export const Line = (props: LineProps) => {
  return (
    <div className={"flex flex-col justify-between gap-1"}>
      <div className={"flex gap-2 items-center"}>
        <div className={"flex items-center bg-black rounded-xl p-1 gap-1"}>
          <Bus className="w-4 h-4 text-white" />
          <span className={"text-xs text-white leading-none"}>
            {props.line}
          </span>
        </div>
        <span
          className={"text-gray-500 font-light text-xs leading-none truncate"}
        >
          {props.destination}
        </span>
      </div>
      <div className={"flex gap-4 items-center"}>
        {props.time.map((t) => (
          <span key={nanoid()} className={"text-xs font-light"}>
            {t} min
          </span>
        ))}
      </div>
    </div>
  );
};
