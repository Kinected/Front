import React from "react";
import { useUserActionsStore } from "@/stores/gestures.store";
import { twMerge } from "tailwind-merge";

type ListeningContainerProps = {
  children?: React.ReactNode;
};

export const ListeningContainer = (props: ListeningContainerProps) => {
  const isListening = useUserActionsStore((state) => state.hand);

  return (
    <div
      className={twMerge(
        "relative w-screen h-screen max-h-screen bg-white",
        isListening && "p-3",
        "transition-all duration-500",
      )}
    >
      <div
        className={twMerge(
          "w-full h-full",
          "bg-black",
          "transition-all duration-500",
          isListening && "p-2 rounded-5xl",
        )}
      >
        {props.children}
      </div>
    </div>
  );
};

export default ListeningContainer;
