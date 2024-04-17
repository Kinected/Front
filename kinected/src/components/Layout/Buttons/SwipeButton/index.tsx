"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { tv } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

type SwipeButtonProps = {
  position: "up" | "down" | "left" | "right";
  isHover?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
};

const container = tv({
  base: [
    "group",
    "flex gap-2 justify-center items-center",
    "w-fit",
    "hover:scale-110",
    "transition-all duration-500",
  ],
  variants: {
    isHover: {
      true: ["scale-110"],
    },
    position: {
      up: "flex-col",
      down: "flex-col-reverse",
      left: "flex-row",
      right: "flex-row-reverse",
    },
  },
});

const content = tv({
  base: [
    "relative",
    "font-medium text-white text-2xl",
    "px-6 py-3 w-fit",
    "rounded-3xl",
    "group-hover:text-black",
    "transition duration-300",
  ],
  variants: {
    isHover: {
      true: ["text-black"],
    },
  },
});

const background = tv({
  base: [
    "bg-white rounded-full",
    "absolute -z-10 inset-0",
    "rounded-2xl bg-white ",
    "scale-50 opacity-0",
    "ring-white/60",
    "transition-all duration-300",
    "group-hover:scale-100 group-hover:opacity-100 group-hover:ring-8",
  ],

  variants: {
    isHover: {
      true: ["scale-100 opacity-100 ring-8"],
    },
  },
});

const bar = tv({
  base: ["bg-white rounded-full", "transition-all duration-500"],
  variants: {
    position: {
      up: "w-2/3 h-1.5 group-hover:w-[125%] group-hover:-translate-y-4",
      down: "w-2/3 h-1.5 group-hover:w-[125%] group-hover:translate-y-4",
      left: "h-2/3 w-1.5 group-hover:h-[125%] group-hover:-translate-y-2",
      right: "h-2/3 w-1.5 group-hover:h-[125%] group-hover:translate-y-2",
    },
    isHover: {
      true: [],
    },
  },

  compoundVariants: [
    {
      position: ["up", "down"],
      isHover: true,
      className: ["w-[125%]"],
    },
    {
      position: ["right", "left"],
      isHover: true,
      className: ["h-[125%]"],
    },
    {
      position: "up",
      isHover: true,
      className: ["-translate-y-4"],
    },
    {
      position: "down",
      isHover: true,
      className: ["translate-y-4"],
    },
    {
      position: "left",
      isHover: true,
      className: ["-translate-y-2"],
    },
    {
      position: "right",
      isHover: true,
      className: ["translate-y-2"],
    },
  ],
});

export const SwipeButton = (props: SwipeButtonProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.3 } }}
        exit={{ opacity: 0 }}
        className={container({
          position: props.position,
          isHover: props.isHover,
        })}
        onClick={props.onClick}
      >
        <div
          className={bar({ position: props.position, isHover: props.isHover })}
        />
        <div
          className={content({
            isHover: props.isHover,
          })}
        >
          <div
            className={background({
              isHover: props.isHover,
            })}
          />
          <span>{props.children}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SwipeButton;
