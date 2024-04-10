import { motion } from "framer-motion";
import React from "react";
import { twMerge } from "tailwind-merge";
import Ilevia from "@/icons/Ilevia.svg";
import Bus from "@/icons/Bus front.svg";

type Props = {
  isHover: boolean;
};

export default function IleviaBusWidget(props: Props) {
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
        <span className={"text-lg font-medium"}>Cormontaigne</span>
      </div>

      <div className={"flex flex-col gap-2"}>
        <Line
          line={"L5"}
          destination={"St. philibert"}
          time={["3 min", "3 min", "3 min"]}
        />
        <Line
          line={"L5"}
          destination={"St. philibert"}
          time={["3 min", "3 min", "3 min"]}
        />
      </div>
    </motion.div>
  );
}

type LineProps = {
  line: string;
  destination: string;
  time: string[];
};
const Line = (props: LineProps) => {
  return (
    <div className={"flex flex-col justify-between gap-1"}>
      <div className={"border-b-2 border-gray-200"} />
      <div className={"flex gap-2 items-center"}>
        <div className={"flex items-center bg-black rounded-xl p-1 gap-1"}>
          <Bus className="w-4 h-4 text-white" />
          <span className={"text-xs text-white leading-none"}>L5</span>
        </div>
        <span className={"text-gray-500 font-light text-sm leading-none"}>
          St. philibert
        </span>
      </div>
      <div className={"flex gap-4 items-center"}>
        <span className={"text-xs font-light"}>3 min</span>
        <span className={"text-xs font-light"}>3 min</span>
        <span className={"text-xs font-light"}>3 min</span>
      </div>
    </div>
  );
};
