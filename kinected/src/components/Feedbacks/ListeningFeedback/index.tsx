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

const listeningContainer = tv({
  base: [
    "relative",
    "flex justify-center items-center",
    'after:content-[""] after:size-full after:absolute after:inset-0 after:rounded-full after:bg-white',
    "rounded-full",
    "size-8",
    "bg-black border-2 border-white",
  ],
  variants: {
    isListening: {
      true: ["after:animate-ping"],
    },
  },
});

const listeningHand = tv({
  base: [
    "relative",
    "size-3",
    "rounded-full",
    "bg-white",
    "opacity-50",

    "transition duration-300",
  ],
  variants: {
    isListening: {
      true: ["opacity-100"],
    },
  },
});

type ListeningFeedbackProps = {
  isListening: boolean;
};

export const ListeningFeedback = (props: ListeningFeedbackProps) => {
  return (
    <div className={container({ isListening: props.isListening })}>
      <div
        className={listeningContainer({
          isListening: props.isListening,
        })}
      >
        <div
          className={listeningHand({
            isListening: props.isListening,
          })}
        />
      </div>
    </div>
  );
};

export default ListeningFeedback;