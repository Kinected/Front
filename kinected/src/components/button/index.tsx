import React from "react";
import { tv } from "tailwind-variants";

type Props = {
  children: React.ReactNode;
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
    "transition-all duration-500 ",
    "after:absolute after:inset-0",
    "after:w-full after:h-full",
    "after:rounded-2xl after:bg-white after:opacity-0",
    "hover:after:opacity-80",
    "after:transition-all after:duration-500 ",
  ],
});

export default function Button(props: Props) {
  return (
    <button
      onClick={props.onClick}
      className={container({
        className: props.className,
      })}
    >
      <div className="flex items-center justify-center gap-2 text-xl font-semibold">
        {props.children}
      </div>
    </button>
  );
}
