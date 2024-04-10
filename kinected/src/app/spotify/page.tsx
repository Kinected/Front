"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PlayerComponent from "@/components/containers/spotify/player";
import SpotifyCarousel from "@/components/containers/spotify/carousel";
import { Song } from "@/types/song";
import { useQuery } from "react-query";
import { fetchSpotifyAccessToken } from "@/utils/requests/spotify/get-access-token";
import { useUserActionsStore } from "@/stores/gestures.store";
import { useRouter } from "next/navigation";
import { playNextSong, playPreviousSong } from "@/utils/requests/spotify/pause";
import { togglePlayerState } from "@/utils/requests/spotify/pause";

export default function Home() {
  const router = useRouter();
  const [previousSong, setPreviousSong] = useState<Song | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const { data: token } = useQuery<string>({
    queryKey: ["spotify", "token"],
    queryFn: async () => {
      return await fetchSpotifyAccessToken("1");
    },
  });

  const updateActionsOnSwipe = useUserActionsStore(
    (state) => state.updateEffectsOnAction,
  );
  const currentSwipe = useUserActionsStore((state) => state.current_action);

  useEffect(() => {
    if (token) {
      updateActionsOnSwipe({
        up: () => router.push("/"),
        left: async () => await playNextSong(token),
        right: async () => await playPreviousSong(token),
        click: async () => {
          await togglePlayerState(token);
        },
      });
    }
  }, [token, isPlaying]);

  if (!token) return null;

  return (
    <AnimatePresence>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.3 } }}
        exit={{ opacity: 0 }}
        className="flex h-full flex-col justify-center gap-12"
      >
        <SpotifyCarousel
          token={token}
          currentSwipe={currentSwipe}
          previous={previousSong}
          setPreviousSong={setPreviousSong}
          current={currentSong}
          setCurrentSong={setCurrentSong}
        />
        <PlayerComponent token={token} />
      </motion.main>
    </AnimatePresence>
  );
}
