import { motion } from "framer-motion";
import React from "react";
import { twMerge } from "tailwind-merge";
import Ilevia from "@/icons/ilevia.svg";
import { useQuery } from "react-query";
import { VlilleData } from "@/types/ilevia";
import { useFaceStore } from "@/stores/faces.store";

type Props = {
  isHover: boolean;
};

export default function IleviaVlilleWidget(props: Props) {
  const userID = useFaceStore((state) => state.userID);
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

  if (!vlilleData) return;

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
          {" "}
          {vlilleData[0].name.split("")[0] +
            vlilleData[0].name.slice(1).toLowerCase()}
        </span>
      </div>
      <div className={"flex flex-col gap-1"}>
        <div className={"flex justify-between items-center"}>
          <span className={""}>Places disponibles</span>
          <span className={"text-gray-500 font-light"}>
            {" "}
            {vlilleData[0].nbPlacesDispo}
          </span>
        </div>
        <div className={"flex justify-between items-center"}>
          <span className={""}>Velos disponibles</span>
          <span className={"text-gray-500 font-light"}>
            {" "}
            {vlilleData[0].nbVelosDispo}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
