"use client";
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SpotifyWidget from "@/components/widgets/Spotify";
import { useRouter } from "next/navigation";
import { useUserActionsStore } from "@/stores/gestures.store";
import { useFaceStore } from "@/stores/faces.store";
import { TeethTimerWidget } from "@/components/widgets/TeethTimer";
import { twMerge } from "tailwind-merge";
import IleviaBusWidget from "@/components/widgets/Ilevia/Bus";
import IleviaVlilleWidget from "@/components/widgets/Ilevia/Vlille";

export default function Home() {
  const router = useRouter();
  const firstname = useFaceStore((state) => state.firstName);
  const userID = useFaceStore((state) => state.userID);
  const gotSpotify = useFaceStore((state) => state.gotSpotify);
  const gotIleviaBus = useFaceStore((state) => state.gotIleviaBus);
  const gotIleviaVlille = useFaceStore((state) => state.gotIleviaVlille);
  const [isHover, setIsHover] = React.useState(false);

  const updateActionsOnSwipe = useUserActionsStore(
    (state) => state.updateEffectsOnAction,
  );

  const current_action = useUserActionsStore((state) => state.current_action);

  useEffect(() => {
    updateActionsOnSwipe({
      "up-right": () => router.push("/spotify"),
      "up-left": () => router.push("/ilevia"),
      "down-right": () => router.push("/mauria"),
      "down-left": () => router.push("/sensors"),
      left: () => router.push("/teeth-timer"),
      click: () => router.push("/audio/chat-voc"),
    });
  }, []);

  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="flex-1 flex items-center justify-between">
        <div />

        <AnimatePresence>
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed -z-[10] inset-0 flex h-full w-full justify-center items-center"
          >
            <div className="flex flex-col items-center">
              <span className="text-white text-8xl text-start ">Bonjour</span>
              <span className="text-white text-8xl text-start font-bold">
                {userID == null
                  ? "Invité"
                  : firstname == ""
                    ? `Utilisateur ${userID}`
                    : firstname}
              </span>
            </div>
          </motion.main>
        </AnimatePresence>

        <div
          className={
            "fixed inset-0 h-full w-full -z-[10] flex items-center justify-between p-4"
          }
        >
          <AnimatePresence>
            <div />
          </AnimatePresence>
          <AnimatePresence>
            <TeethTimerWidget
              isHover={current_action == "hover_left"}
              onClick={() => router.push("/teeth-timer")}
            />
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-between items-end">
        <AnimatePresence>
          {gotSpotify ? (
            <SpotifyWidget
              isHover={current_action == "hover_up-right"}
              onClick={() => router.push("/spotify")}
            />
          ) : (
            <div />
          )}
        </AnimatePresence>

        <AnimatePresence>
          <div
            onClick={() => setIsHover(!isHover)}
            className={twMerge(
              "flex flex-col w-fit",
              current_action == "hover_up-left" ? "gap-10" : "gap-4",
            )}
          >
            {gotIleviaBus && (
              <IleviaBusWidget isHover={current_action == "hover_up-left"} />
            )}
            {gotIleviaVlille && (
              <IleviaVlilleWidget isHover={current_action == "hover_up-left"} />
            )}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
