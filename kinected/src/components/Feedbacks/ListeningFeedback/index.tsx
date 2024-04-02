import React from "react";
import clsx from "clsx";
import { tv } from "tailwind-variants";

const container = tv({
  base: [
    "absolute inset-0",
    "flex justify-center items-center gap-4",
    "h-8",
    "-translate-y-full opacity-0",
    "transition",
  ],

  variants: {
    isListening: {
      true: ["translate-y-0", "opacity-100"],
    },
  },
});

const listeningHand = tv({
  base: [
    "relative",
    "size-4",
    "rounded-full",
    "bg-white",
    "opacity-50",
    'after:content-[""] after:size-full after:absolute after:inset-0 after:rounded-full after:bg-white',
    "transition",
  ],
  variants: {
    isListening: {
      true: ["opacity-100", "after:animate-ping"],
    },
  },
});

type ListeningFeedbackProps = {
  hand: "right_hand" | "left_hand" | null;
};

export const ListeningFeedback = (props: ListeningFeedbackProps) => {
  return (
    <div className={clsx("relative")}>
      <div className={container({ isListening: !!props.hand })}>
        <div
          className={listeningHand({
            isListening: props.hand === "left_hand",
          })}
        />
        <div
          className={listeningHand({
            isListening: props.hand === "right_hand",
          })}
        />
      </div>
    </div>
  );
};

export default ListeningFeedback;