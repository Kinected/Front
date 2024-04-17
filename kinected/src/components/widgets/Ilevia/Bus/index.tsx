import { motion } from "framer-motion";
import React from "react";
import Ilevia from "@/icons/Apps/ilevia.svg";
import Bus from "@/icons/Apps/Ilevia/Bus front.svg";
import { nanoid } from "nanoid";
import { useFaceStore } from "@/stores/faces.store";
import { useQuery } from "react-query";
import { BusData } from "@/types/ilevia";
import { tv } from "tailwind-variants";

type Props = {
  isHover: boolean;
};

const container = tv({
  base: [
    "relative",
    "flex flex-col gap-2",
    "min-w-64",
    "bg-white rounded-3xl p-3",
    "origin-bottom-right transition-all duration-500",
    "ring-white/60",
  ],
  variants: {
    isHover: {
      true: ["scale-110 ring-10"],
    },
  },
});

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
      refetchInterval: 10000 * 60,
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
      className={container({
        isHover: props.isHover,
      })}
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
