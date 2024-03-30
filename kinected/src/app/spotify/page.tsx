"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PlayerComponent from "@/components/containers/spotify/player";
import SpotifyCarousel from "@/components/containers/spotify/carousel";
import { Song } from "@/types/song";

const token =
    "BQA6392Lx9tK6Ma5pegyO8l5hfZQgjvvyV7gGw6TKNVJHv-TI4v1FtHHgeWLHTvskubMGnl7yWZEo4dy2q8Fo731KzZGJYfDcayyLn9F6KuNsZSLaHDHHmukujgYHQCl8DtixAWh-ympCvqEfsf7r1jcZSrrrMovuwfm3VyqRZvKfoAqFiTSdH_RyXb4YcpwLSvZ7SoEcAjEMvRZlg";

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
