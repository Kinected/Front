"use client";
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import { User } from "@/types/user";
import { fetchUser } from "@/utils/get-user";
import SpotifyPlayer from "@/components/widgets/Spotify";
import MauriaWidget from "@/components/containers/mauria/widget";
import { useRouter } from "next/navigation";
import { useUserActionsStore } from "@/stores/gestures.store";
import { useFaceStore } from "@/stores/faces.store";

export default function Home() {
  const router = useRouter();
  const firstname = useFaceStore((state) => state.firstName);
  const [isDisplayed, setIsDisplayed] = React.useState(true);
  const isNewUser = useFaceStore((state) => state.isNewUser);

  // // detect if firstname changed
  // useEffect(() => {
  //     setIsDisplayed(true);
  //     setTimeout(() => {
  //         setIsDisplayed(false);
  //     }, 5000);
  // }, [firstname]);

  const updateActionsOnSwipe = useUserActionsStore(
    (state) => state.updateEffectsOnAction,
  );

  const current_action = useUserActionsStore((state) => state.current_action);

  useEffect(() => {
    updateActionsOnSwipe({
      "up-right": () => router.push("/spotify"),
      click: () => console.log("click"),
    });
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 flex items-center justify-center">
        {isDisplayed && (
          <AnimatePresence>
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full w-full justify-center items-center"
            >
              <div className="flex flex-col items-center">
                <span className="text-white text-8xl text-start ">Bonjour</span>
                <span className="text-white text-8xl text-start font-bold">
                  {firstname}
                </span>
                <span className="text-white">
                  {isNewUser ? "true" : "false"}
                </span>
              </div>
            </motion.main>
          </AnimatePresence>
        )}
      </div>

      <div className="flex justify-between items-end">
        <AnimatePresence>
          <SpotifyPlayer
            isHover={current_action == "hover_up-right"}
            onClick={() => router.push("/spotify")}
          />
        </AnimatePresence>
        {/*<AnimatePresence>*/}
        {/*    <MauriaWidget />*/}
        {/*</AnimatePresence>*/}
      </div>
    </div>
  );
}
