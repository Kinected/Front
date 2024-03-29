import React from "react";
import Image from "next/image";
import Arrow from "@/../public/arrow.svg";
import { Song } from "@/types/song";
import { useQuery } from "react-query";
import { fetchCurrentlyPlaying } from "@/utils/currently-playing";
import { fetchPreviousSong } from "@/utils/previously-playing";
import { fetchNextSong, playNextSong, playPreviousSong } from "@/utils/pause";

type Props = {
    token: string;
    previous: Song | null;
    setPreviousSong: (song: Song) => void;
    current: Song | null;
    setCurrentSong: (song: Song) => void;
};

export default function SpotifyCarousel(props: Props) {
    const { data: song } = useQuery<Song | null>({
        queryKey: ["song", "current"],
        queryFn: async () => {
            const newSong = await fetchCurrentlyPlaying(props.token);
            if (props.current?.track !== newSong.track) {
                if (props.current) props.setPreviousSong(props.current);
                props.setCurrentSong(newSong);
            }
            return newSong;
        },
        refetchInterval: 1000,
    });

    const { data: previous } = useQuery<Song | null>({
        queryKey: ["song", "previous"],
        queryFn: async () => {
            const data = await fetchPreviousSong(props.token);
            props.setPreviousSong(data);
            return data;
        },
    });

    const { data: next } = useQuery<Song | null>({
        queryKey: ["song", "next"],
        queryFn: async () => {
            const data = await fetchNextSong(props.token);
            return data;
        },
        refetchInterval: 1000,
    });

    if (!song || !previous || !props.previous || !props.current || !next)
        return null;

    return (
        <div className="flex items-center relative h-full w-full">
            <div className="absolute left-0 -translate-x-1/2 w-1/3 max-w-xs aspect-square bg-white rounded-2xl flex justify-center items-center">
                <Image
                    src={props.previous.cover}
                    fill
                    className="fit-cover rounded-2xl"
                    alt="cover current song"
                />
                <div className="relative w-full h-full">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 hover:scale-125 animation-all duration-500 bg-white shadow rounded-full flex items-center justify-center">
                        <Arrow
                            className="h-6 rotate-180 ml-1"
                            onClick={() => playPreviousSong(props.token)}
                        />
                    </div>
                </div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 w-1/2 max-w-sm aspect-square bg-white rounded-2xl">
                <Image
                    src={props.current.cover}
                    fill
                    className="fit-cover rounded-2xl"
                    alt="cover current song"
                />
            </div>
            <div className="absolute right-0 translate-x-1/2 w-1/3 max-w-xs aspect-square bg-white rounded-2xl flex items-center justify-center">
                <Image
                    src={next.cover}
                    fill
                    className="fit-cover rounded-2xl"
                    alt="cover current song"
                />
                <div className="relative w-full h-full">
                    <div className="absolute -translate-x-1/2 top-1/2 -translate-y-1/2 w-10 h-10 hover:scale-125 animation-all duration-500 bg-white shadow rounded-full flex items-center justify-center">
                        <Arrow
                            className="h-6 mr-1"
                            onClick={() => playNextSong(props.token)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
