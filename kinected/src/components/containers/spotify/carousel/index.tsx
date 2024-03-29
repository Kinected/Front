import React from "react";
import Image from "next/image";
import Arrow from "@/../public/arrow.svg";
import { Song } from "@/types/song";

type Props = {
    song: Song;
    previous: Song;
};

export default function SpotifyCarousel(props: Props) {
    return (
        <div className="flex items-center relative h-full w-full">
            <div className="absolute left-0 -translate-x-1/2 w-1/3 aspect-square bg-white rounded-2xl flex justify-center items-center">
                <Image
                    src={props.previous.cover}
                    fill
                    className="fit-cover rounded-2xl"
                    alt="cover current song"
                />
                <div className="relative w-full h-full">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 bg-white shadow rounded-full flex items-center justify-center">
                        <Arrow className="h-6 rotate-180 ml-1" />
                    </div>
                </div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 w-1/2 aspect-square bg-white rounded-2xl">
                <Image
                    src={props.song.cover}
                    fill
                    className="fit-cover rounded-2xl"
                    alt="cover current song"
                />
            </div>
            <div className="absolute right-0 translate-x-1/2 w-1/3 aspect-square bg-white rounded-2xl flex items-center justify-center">
                <Image
                    src="https://i.scdn.co/image/ab6761610000e5eba03696716c9ee605006047fd"
                    fill
                    className="fit-cover rounded-2xl"
                    alt="cover current song"
                />
                <div className="relative w-full h-full">
                    <div className="absolute -translate-x-1/2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow rounded-full flex items-center justify-center">
                        <Arrow className="h-6 mr-1" />
                    </div>
                </div>
            </div>
        </div>
    );
}
