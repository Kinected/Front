"use client";

import React from "react";

import ToothBrush from "../../../icons/ToothBrush.svg";
import Clock from "../../../icons/Circle Clock.svg";
import Link from "next/link";
import { useTeethTimerStore } from "@/stores/teethTimer.store";
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
    "bg-white text-black",
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
  const { time, formatTime,  isRunning, isFinished } = useTeethTimerStore((state) => state);

  return (
    <Link
      href={"/teeth-timer"}
      className={container({
        isHover: props.isHover,
      })}
    >
      <div className={"relative size-16"}>
        <ToothBrush className={"size-16 -ml-1 -mt-1"} />
        <Clock className={"size-8 absolute bottom-0 right-0 -mr-1 -mb-1"} />
      </div>


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

          {isRunning ? formatTime(time) : ""}
        </span>
      )}
    </Link>
  );
};
