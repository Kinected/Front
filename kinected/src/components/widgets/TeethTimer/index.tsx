"use client";

import React from "react";

import ToothBrush from "../../../icons/ToothBrush.svg";
import Link from "next/link";
import { useTeethTimer } from "@/hooks/useTeethTimer";
import { useTeethTimerStore } from "@/stores/teethTimerStore.store";
import { tv } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

type TeethTimerWidgetProps = {
  isHover: boolean;
  onClick: () => void;
};

const container = tv({
  base: [
    "relative",
    "flex flex-col gap-4 items-center",
    "bg-black text-white",
    "max-w-24 p-4",
    "rounded-3xl border-4 border-white",
    "origin-right transition-all duration-500",
  ],
  variants: {
    isHover: {
      true: ["scale-110", "bg-white text-black", "ring-8 ring-white/50"],
    },
  },
});
export const TeethTimerWidget = (props: TeethTimerWidgetProps) => {
  const isDefaultRunning = useTeethTimerStore((state) => state.isRunning);
  const time = useTeethTimerStore((state) => state.time);
  const { timerTime, isRunning, formattedTime } = useTeethTimer({
    initialTime: time,
    isDefaultRunning: isDefaultRunning || false,
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

      <span
        className={twMerge(
          "font-bold text-center leading-none",
          isRunning && "text-xl",
        )}
      >
        {isRunning ? formattedTime : "Minuteur brossage de dent"}
      </span>
    </Link>
  );
};
