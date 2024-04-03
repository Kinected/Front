import React from "react";
import Image from "next/image";
import Arrow from "@/../public/arrow.svg";
import { Song } from "@/types/song";
import { useQuery } from "react-query";
import { fetchCurrentlyPlaying } from "@/utils/currently-playing";
import { fetchPreviousSong } from "@/utils/previously-playing";
import { fetchNextSong, playNextSong, playPreviousSong } from "@/utils/pause";
import CarouselItem from "./item";

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
            if (!newSong) return null;
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

    if (!props.previous || !props.current || !next) {
        if (props.previous != null) {
            return (
                <div className="flex items-center relative h-full w-full">
                    <CarouselItem
                        position="center"
                        cover={props.previous.cover}
                    />
                </div>
            );
        }
    } else {
        return (
            <div className="flex items-center relative h-full w-full">
                <CarouselItem
                    position="left"
                    cover={props.previous.cover}
                    onClick={() => playPreviousSong(props.token)}
                />
                <CarouselItem position="center" cover={props.current.cover} />
                <CarouselItem
                    position="right"
                    cover={next.cover}
                    onClick={() => playNextSong(props.token)}
                />
            </div>
        );
    }
}
