import React from "react";
import Arrow from "../../../../../icons/arrow.svg";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

type Props = {
  position: "left" | "center" | "right";
  content?: string;
  isHover?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
};

const item = tv({
  base: [
    "relative aspect-square min-h-96",
    "col-span-1",
    "flex justify-center items-center",
    "bg-white rounded-2xl",
    "aspect-square",
    "border-4 border-white border-solid",
    "duration-300",
  ],

  variants: {
    position: {
      center: ["col-span-4 left-1/2 -translate-x-1/2"],
      left: ["transition-all h-3/4 justify-self-end"],
      right: ["transition-all h-3/4"],
    },

    isHover: {
      true: ["scale-110"],
    },
  },
});

export default function CarouselItemApp(props: Props) {
  return (
    <div
      className={item({
        position: props.position,
        isHover: props.isHover,
      })}
    >
      {props.children ? (
        <div
          className={"overflow-hidden w-full h-full bg-gray-200 rounded-2xl"}
        >
          {props.children}
        </div>
      ) : (
        <div className="w-full h-full bg-gray-200 rounded-2xl" />
      )}

      {props.position !== "center" && (
        // <div className="relative w-full h-full">
        <div
          className={twMerge(
            props.position === "left" && "right-0 translate-x-1/2",
            props.position === "right" && "left-0 -translate-x-1/2",
            "absolute top-1/2 -translate-y-1/2",
            "size-12 bg-white shadow rounded-full ",
            "flex items-center justify-center",
            "hover:scale-125 animation-all duration-500 "
          )}
        >
          <Arrow
            className={twMerge(
              "h-8",
              props.position === "left" && "rotate-180 ml-1",
              props.position === "right" && "mr-1"
            )}
            onClick={() => props.onClick && props.onClick()}
          />
        </div>
        // </div>
      )}
    </div>
  );
}
