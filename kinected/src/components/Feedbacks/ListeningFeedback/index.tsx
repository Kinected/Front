import React from "react";
import { tv } from "tailwind-variants";

const container = tv({
  base: [
    "flex justify-center items-center gap-4",
    "-translate-y-full opacity-0",
    "transition duration-300",
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
    "transition duration-300",
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
  );
};

export default ListeningFeedback;