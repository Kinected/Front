"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Pause from "@/../public/Pause.svg";
import Arrow from "@/../public/arrow.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PlayerComponent from "@/components/containers/spotify/player";
import { fetchCurrentlyPlaying } from "@/utils/currently-playing";
import { useQuery } from "react-query";
import { Song } from "@/types/song";
import { fetchPreviousSong } from "@/utils/previously-playing";
import SpotifyCarousel from "@/components/containers/spotify/carousel";

const token =
    "BQAal_4xs0uuiVCSKE08fl_hffGqX_1tz4dB0CBU3KuFRYwKpsNiykqvbagQqbJYj5steOjVjb-zPj619zY2YTgn476cutX5AWhFZm71CJwWlSZeDYxqEgq6COjeOZyThjd1skLi73lPlLoQEmeNjGf4ZpNCdpz3sUeNds48S27vrZFUCCY";

export default function Home() {
    const previousSongRef = useRef<Song | null>(null);

    const { data: song } = useQuery<Song | null>({
        queryKey: ["song", "current"],
        queryFn: async () => {
            const newSong = await fetchCurrentlyPlaying(token);
            return newSong;
        },
        refetchInterval: 1000,
    });

    useEffect(() => {
        if (
            song &&
            (!previousSongRef.current ||
                song.track !== previousSongRef.current.track)
        ) {
            previousSongRef.current = song;
        }
    }, [song]);

    const { data: previous } = useQuery<Song | null>({
        queryKey: ["song", "previous"],
        queryFn: async () => {
            const da = await fetchPreviousSong(token);
            return da;
        },
    });

    if (!song || !previous) return;

    return (
        <AnimatePresence>
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3 } }}
                exit={{ opacity: 0 }}
                className="flex h-full w-full flex-col gap-12"
            >
                <SpotifyCarousel song={song} previous={previous} />
                <PlayerComponent song={song} />
            </motion.main>
        </AnimatePresence>
    );
}
