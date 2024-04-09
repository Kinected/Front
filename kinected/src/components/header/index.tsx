import React, { useEffect, useState } from "react";
import Button from "../button";
import { useRouter } from "next/navigation";
import Apps from "@/../public/apps.svg";
import Weather from "../containers/weather";
import ListeningFeedback from "@/components/Feedbacks/ListeningFeedback";
import { useUserActionsStore } from "@/stores/gestures.store";


export default function Header() {
  const [time, setTime] = useState(new Date());
  const router = useRouter();

  const hand = useUserActionsStore((state) => state.hand);
  const deltas = useUserActionsStore((state) => state.deltas);
  const action = useUserActionsStore((state) => state.current_action);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const current_action = useUserActionsStore((state) => state.current_action);

  const updateActionsOnSwipe = useUserActionsStore(
      (state) => state.updateEffectsOnAction,
  );

  return (
    <div className="flex justify-between">
      <div className="flex-1">
        <Button className="origin-top-left">
          <Apps className="w-8 h-8" />
          Apps
        </Button>
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
        <Weather isHover={current_action == "hover_down-left"}/>
      </div>
    </div>
  );
}
