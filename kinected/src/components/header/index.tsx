import React, { useEffect, useState } from "react";
import Weather from "../widgets/Weather";
import ListeningFeedback from "@/components/Feedbacks/ListeningFeedback";
import { useUserActionsStore } from "@/stores/gestures.store";
import { AnimatePresence } from "framer-motion";
import { useFaceStore } from "@/stores/faces.store";
import { usePathname, useRouter } from "next/navigation";
import MauriaWidget from "@/components/widgets/Mauria";

export default function Header() {
  const [time, setTime] = useState(new Date());
  const path = usePathname();
  const router = useRouter();

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

  const gotMauria = useFaceStore((state) => state.gotMauria);

  return (
    <div className="flex justify-between w-full">
      <div className="flex-1">
        {path == "/" && (
          <AnimatePresence>
            {gotMauria && (
              <MauriaWidget
                isHover={current_action == "hover_down-right"}
                onClick={() => router.push("/mauria")}
              />
            )}
          </AnimatePresence>
        )}
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
        {path == "/" && (
          <AnimatePresence>
            <Weather isHover={current_action == "hover_down-left"} />
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
