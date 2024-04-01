"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PlayerComponent from "@/components/containers/spotify/player";
import SpotifyCarousel from "@/components/containers/spotify/carousel";
import { Song } from "@/types/song";
import { useQuery } from "react-query";
import { fetchSpotifyAccessToken } from "@/utils/get-access-token";

export default function Home() {
    const [previousSong, setPreviousSong] = useState<Song | null>(null);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);

    const { data: token } = useQuery<string>({
        queryKey: ["spotify", "token"],
        queryFn: async () => {
            return await fetchSpotifyAccessToken("1");
        },
    });

    if (!token) return null;

    return (
        <AnimatePresence>
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3 } }}
                exit={{ opacity: 0 }}
                className="flex h-full w-full flex-col gap-12"
            >
                <SpotifyCarousel
                    token={token}
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
