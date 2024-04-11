"use client";

import React from "react";

import ToothBrush from "../../../icons/ToothBrush.svg";
import Link from "next/link";
import { useTeethTimer } from "@/hooks/useTeethTimer";
import { useTeethTimerStore } from "@/stores/teethTimerStore.store";
import { tv } from "tailwind-variants";

type TeethTimerWidgetProps = {
  isHover: boolean;
  onClick: () => void;
};

const container = tv({
  base: [
    "relative",
    "flex flex-col gap-4 items-center",
    "bg-black text-white",
    " max-w-24 p-4",
    "rounded-3xl border-4",
    "origin-right transition-all duration-500",
    "after:absolute after:top-0 after:left-0 after:-z-10 after:opacity-0",
    "after:bg-white after:rounded-3xl",
    "after:w-full after:h-full",
    "after:transition-all after:duration-500",
  ],
  variants: {
    isHover: {
      true: ["scale-110 after:opacity-40 after:scale-125 after:rounded-3xl"],
    },
  },
});
export const TeethTimerWidget = (props: TeethTimerWidgetProps) => {
  const isRunning = useTeethTimerStore((state) => state.isRunning);
  const time = useTeethTimerStore((state) => state.time);
  const { timerTime, formattedTime } = useTeethTimer({
    initialTime: time,
    isDefaultRunning: isRunning || false,
  });

  console.log("timerTime", timerTime, "formattedTime", formattedTime);

  return (
    <Link
      href={"/teeth-timer"}
      className={container({
        isHover: props.isHover,
      })}
    >
      <ToothBrush className={"size-16"} />

      <span className={"text-xl font-bold text-center"}>
        {formattedTime === "00:00"
          ? "Minuteur brossage de dent"
          : formattedTime}
      </span>
    </Link>
  );
};
