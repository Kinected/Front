import React from "react";
import { tv } from "tailwind-variants";
import { Deltas } from "@/hooks/useGestures";

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
    "transition ease-out",
  ],
  variants: {
    isListening: {
      true: ["opacity-100"],
    },
  },
});

type ListeningFeedbackProps = {
  isListening: boolean;
  deltas: Deltas;
};
const SENSITIVITY = 0.5;

export const ListeningFeedback = (props: ListeningFeedbackProps) => {
  // -1 because we mirror the hand
  const x = Math.max(-100, Math.min(100, props.deltas.x * SENSITIVITY));
  const y = Math.max(-100, Math.min(100, props.deltas.y * SENSITIVITY));

  console.log();

  return (
    <div className={container({ isListening: props.isListening })}>
      <div
        className={listeningContainer({
          isListening: props.isListening,
        })}
      >
        <div
          style={{
            transform: `translate(${x}%, ${y}%)`,
          }}
          className={listeningHand({
            isListening: props.isListening,
          })}
        />
      </div>
    </div>
  );
};

export default ListeningFeedback;