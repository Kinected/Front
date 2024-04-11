"use client";
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SpotifyPlayer from "@/components/widgets/Spotify";
import MauriaWidget from "@/components/widgets/Mauria";
import { useRouter } from "next/navigation";
import { useUserActionsStore } from "@/stores/gestures.store";
import { useFaceStore } from "@/stores/faces.store";

export default function Home() {
  const router = useRouter();
  const firstname = useFaceStore((state) => state.firstName);
  const userID = useFaceStore((state) => state.userID);
  const [isDisplayed, setIsDisplayed] = React.useState(true);
  const isNewUser = useFaceStore((state) => state.isNewUser);
  const gotMauria = useFaceStore((state) => state.gotMauria);
  const gotSpotify = useFaceStore((state) => state.gotSpotify);

  const [isHover, setIsHover] = React.useState(false);

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
      "up-left": () => router.push("/mauria"),
      "down-left": () => router.push("/sensors"),
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
              className="flex h-full w-full justify-center items-center fixed left-0 top-0"
            >
              <div className="flex flex-col items-center">
                <span className="text-white text-8xl text-start ">Bonjour</span>
                <span className="text-white text-8xl text-start font-bold">
                  {firstname == "" ? `Utilisateur ${userID}` : firstname}
                </span>
              </div>
            </motion.main>
          </AnimatePresence>
        )}
      </div>

      <div className="flex justify-between items-end">
        <AnimatePresence>
          {gotSpotify && (
            <SpotifyPlayer
              isHover={current_action == "hover_up-right"}
              onClick={() => router.push("/spotify")}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {gotMauria && (
            <MauriaWidget
              isHover={current_action == "hover_up-left"}
              onClick={() => router.push("/mauria")}
            />
          )}
        </AnimatePresence>
        {/*<AnimatePresence>*/}
        {/*  <div*/}
        {/*    onClick={() => setIsHover(!isHover)}*/}
        {/*    className={twMerge("flex flex-col", isHover ? "gap-10" : "gap-4")}*/}
        {/*  >*/}
        {/*    <IleviaBusWidget isHover={isHover} />*/}
        {/*    <IleviaVlilleWidget isHover={isHover} />*/}
        {/*  </div>*/}
        {/*</AnimatePresence>*/}
      </div>
    </div>
  );
}
