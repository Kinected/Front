import React, { useEffect } from "react";
import { tv } from "tailwind-variants";
import { useUserActionsStore } from "@/stores/gestures.store";

import styles from "./Button.module.scss";

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
    "ring-white/60",
    "transition-all duration-500",
  ],

  variants: {
    isHover: {
      true: ["scale-110 ring-10"],
    },
    isAnimating: {
      true: ["scale-110 ring-10"],
    },
  },
});

export default function Button(props: Props) {
  const current_action = useUserActionsStore((state) => state.current_action);
  const [isAnimating, setIsAnimating] = React.useState(false);

  useEffect(() => {
    if (current_action === "click" && !isAnimating) {
      setIsAnimating(true);

      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }

    console.log("current_action", current_action, isAnimating);
  }, [current_action, isAnimating]);

  return (
    <button
      onClick={() => {
        props.onClick?.();
      }}
      className={container({
        isHover: props.isHover,
        isAnimating: isAnimating,
        className: props.className,
      })}
    >
      <div className="relative flex items-center justify-center gap-2 z-10 text-xl font-semibold">
        {props.children}
      </div>
    </button>
  );
}
