import React, { useEffect, useState } from "react";
import Weather from "../widgets/Weather";
import ListeningFeedback from "@/components/Feedbacks/ListeningFeedback";
import { useUserActionsStore } from "@/stores/gestures.store";
import { AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import IleviaBusWidget from "@/components/widgets/Ilevia/Bus";
import IleviaVlilleWidget from "@/components/widgets/Ilevia/Vlille";
import { useFaceStore } from "@/stores/faces.store";

export default function Header() {
  const [time, setTime] = useState(new Date());

  const hand = useUserActionsStore((state) => state.hand);
  const deltas = useUserActionsStore((state) => state.deltas);
  const action = useUserActionsStore((state) => state.current_action);

  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const current_action = useUserActionsStore((state) => state.current_action);

  const gotIleviaBus = useFaceStore((state) => state.gotIleviaBus);
  const gotIleviaVlille = useFaceStore((state) => state.gotIleviaVlille);

  return (
    <div className="flex justify-between">
      <div className="flex-1">
        <AnimatePresence>
          <div
            onClick={() => setIsHover(!isHover)}
            className={twMerge(
              "flex flex-col w-fit",
              isHover ? "gap-10" : "gap-4",
            )}
          >
            {gotIleviaBus && <IleviaBusWidget isHover={isHover} />}
            {gotIleviaVlille && <IleviaVlilleWidget isHover={isHover} />}
          </div>
        </AnimatePresence>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <div className="flex flex-col">
          <span className="text-white text-2xl text-center font-light capitalize">
            {time.toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
          <span className="text-white text-8xl text-center font-bold">
            {`${time.getHours().toString().padStart(2, "0")}:${time
              .getMinutes()
              .toString()
              .padStart(2, "0")}`}
          </span>
        </div>

        <ListeningFeedback
          action={action}
          isListening={!!hand}
          deltas={deltas}
        />
      </div>

      <div className="flex-1 flex justify-end items-start">
        <AnimatePresence>
          <Weather isHover={current_action == "hover_down-left"} />
        </AnimatePresence>
      </div>
    </div>
  );
}
