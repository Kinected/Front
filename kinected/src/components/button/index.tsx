import React from "react";
import { tv } from "tailwind-variants";

type Props = {
  children: React.ReactNode;
  isHover?: boolean;
  onClick?: () => void;
  className?: string;
};

const container = tv({
  base: [
    "relative",
    "py-3 px-6",
    "bg-white text-black",
    "rounded-2xl",
    "hover:scale-110",
    "ring-white/50",
    "transition-all duration-500",
  ],

  variants: {
    isHover: {
      true: ["scale-110 ring-8"],
    },
  },
});

export default function Button(props: Props) {
  return (
    <button
      onClick={props.onClick}
      className={container({
        isHover: props.isHover,
        className: props.className,
      })}
    >
      <div className="relative flex items-center justify-center gap-2 z-10 text-xl font-semibold">
        {props.children}
      </div>
    </button>
  );
}
