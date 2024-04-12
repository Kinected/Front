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
    "ring-white/60",
  ],
  variants: {
    isHover: {
      true: ["scale-110", "bg-white text-black", "ring-10"],
    },
  },
});
export const TeethTimerWidget = (props: TeethTimerWidgetProps) => {
  const isDefaultRunning = useTeethTimerStore((state) => state.isRunning);
  const time = useTeethTimerStore((state) => state.time);
  const { isFinished, isRunning, formattedTime } = useTeethTimer({
    initialTime: time,
    isDefaultRunning: isDefaultRunning || false,
  });

  return (
    <Link
      href={"/teeth-timer"}
      className={container({
        isHover: props.isHover,
      })}
    >
      <ToothBrush className={"size-16"} />

      {isFinished ? (
        <>
          <div
            className={
              "absolute inset-0 size-full bg-white rounded-3xl -z-10 border-8 ring-12 ring-white/80 animate-pulse"
            }
          />
          <span className={"relative font-bold text-center"}>
            Minuteur Terminé
          </span>
        </>
      ) : (
        <span
          className={twMerge(
            "font-bold text-center leading-none",
            isRunning && "text-xl",
          )}
        >
          {isRunning ? formattedTime : "Minuteur brossage de dent"}
        </span>
      )}
    </Link>
  );
};
