import React from "react";
import { tv } from "tailwind-variants";
import Arrow from "@/icons/arrow.svg";
import { twMerge } from "tailwind-merge";

type ConfirmButtonProps = {
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
  position: "left" | "right";
  isHover: boolean;
  className?: string;
};

const container = tv({
  base: [
    "relative",
    "flex flex-col items-center justify-center gap-2",
    "size-40 p-6",
    "origin-left transition-all duration-500",
    "border-4 border-white text-white",
    "ring-white/60",
    "rounded-full",
    "hover:scale-110 hover:bg-white hover:text-black hover:ring-10",
  ],

  variants: {
    isHover: {
      true: ["scale-110", "bg-white text-black", "ring-10"],
    },
  },
});

const arrow = tv({
  base: [
    "absolute",
    "flex items-center justify-center",
    "size-12 rounded-full",
    "bg-white",
    "top-1/2 -translate-y-1/2",
    "transition-all duration-1000",
  ],

  variants: {
    position: {
      left: [],
      right: [],
    },
    isHover: {
      true: [],
    },
  },

  compoundVariants: [
    {
      position: "left",
      isHover: false,
      className: ["right-0 translate-x-1/2"],
    },
    {
      position: "left",
      isHover: true,
      className: ["right-0 translate-x-[150%]"],
    },
    {
      position: "right",
      isHover: false,
      className: ["left-0 -translate-x-1/2"],
    },
    {
      position: "right",
      isHover: true,
      className: ["left-0 -translate-x-[150%]"],
    },
  ],

  defaultVariants: {
    isHover: false,
    position: "right",
  },
});

export const ConfirmButton = (props: ConfirmButtonProps) => {
  return (
    <button
      className={container({
        isHover: props.isHover,
      })}
    >
      {props.icon}
      <span className="font-medium text-xl">{props.text}</span>
      <div
        className={arrow({
          position: props.position,
          isHover: props.isHover,
        })}
      >
        <Arrow
          className={twMerge(
            "size-8 text-black",
            props.position === "left" && "rotate-180",
          )}
        />
      </div>
    </button>
  );
};

export default ConfirmButton;
