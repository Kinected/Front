import React, { useEffect, useState } from "react";
import { tv } from "tailwind-variants";
import { Deltas } from "@/hooks/useUserActions";
import { Actions, VALID_ACTIONS } from "@/stores/gestures.store";
import styles from "./ListeningFeedback.module.scss";

const container = tv({
  base: [
    "flex justify-center items-center gap-4",
    "-translate-y-full opacity-0",
    "bg-red",
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
    "rounded-full",
    "bg-black",
    "size-8",
    "bg-black border-2 border-white",
    "transition duration-1000",
  ],
  variants: {
    actionIsValid: {
      true: [styles["is-activated"]],
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
  action: Actions | null;
  deltas: Deltas;
};
const SENSITIVITY = 0.5;

export const ListeningFeedback = (props: ListeningFeedbackProps) => {
  // -1 because we mirror the hand
  const x = -1 * Math.max(-100, Math.min(100, props.deltas.x * SENSITIVITY));
  const y = Math.max(-100, Math.min(100, props.deltas.y * SENSITIVITY));

  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    let isAction = false;

    console.log("hello")

    if (props.action) {
      isAction = VALID_ACTIONS.includes(props.action);
    }

    if (props.isListening && isAction) {
      setIsAnimated(true);
    }
  }, [props.action, props.isListening]);

  return (
    <div
      className={container({ isListening: props.isListening })}
      onAnimationEnd={() => {
        if (isAnimated) {
          setIsAnimated(false);
        }
      }}
    >
      <div
        className={listeningContainer({
          actionIsValid: isAnimated,
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
