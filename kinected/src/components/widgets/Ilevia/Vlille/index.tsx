import { motion } from "framer-motion";
import React from "react";
import Ilevia from "@/icons/ilevia.svg";
import { useQuery } from "react-query";
import { VlilleData } from "@/types/ilevia";
import { useFaceStore } from "@/stores/faces.store";
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
      refetchInterval: 10000 * 60,
    },
  );

  if (!vlilleData) return;

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
