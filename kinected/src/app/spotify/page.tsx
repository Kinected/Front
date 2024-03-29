"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PlayerComponent from "@/components/containers/spotify/player";
import SpotifyCarousel from "@/components/containers/spotify/carousel";
import { Song } from "@/types/song";

const token =
    "BQB6XhPnDBOQFYqPEq6pCl_Tog_AnCjIZ1uYprfZW_il3zr1KQS5Kr_4THkivFGTJmsgijuQnONvLcrbEro721JqxPZ2HFU2E3C9pzsd6-DvZrTLEd3Sm254nbNRY1nguUDA29enQdJAnn0zKtxnvz9IUaAdxKdQgdYUjN9KNFQ33s0t5pFQ2s_fasiYfkyGeFew0Z4ovrYipAobtg";

export default function Home() {
    const [previousSong, setPreviousSong] = useState<Song | null>(null);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);

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
