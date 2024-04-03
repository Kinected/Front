import { useEffect, useState } from "react";
import Pause from "@/../public/Pause.svg";
import { useQuery } from "react-query";
import { fetchCurrentlyPlaying } from "@/utils/currently-playing";
import { Song } from "@/types/song";
import Play from "@/../public/Play.svg";
import { tooglePlayerState } from "@/utils/pause";

type Props = {
    token: string;
};

const PlayerComponent = (props: Props) => {
    const { data: song } = useQuery<Song | null>({
        queryKey: ["song", "current"],
        queryFn: async () => await fetchCurrentlyPlaying(props.token),
        refetchInterval: 1000,
    });

    const { data: previous } = useQuery<Song | null>({
        queryKey: ["song", "previous"],
        queryFn: async () => await fetchCurrentlyPlaying(props.token),
    });

    const displaySong = song || previous;
    if (!displaySong) return;

    const progressPercentage = displaySong.progress * 100;

    return (
        <div className="flex justify-center items-center">
            <div className="w-1/2 max-w-sm bg-white rounded-2xl flex flex-col items-center justify-between p-4 px-12">
                <div className="flex flex-col gap-2 w-full items-center">
                    <div className="flex flex-col items-center text-sm">
                        <span className="truncate text-center font-medium leading-tight	 ">
                            {displaySong.track}
                        </span>
                        <span className="font-light text-gray-500 leading-tight	">
                            {displaySong.artist}
                        </span>
                    </div>

                    <div className="relative w-full border border-gray-200 bg-gray-100 border-solid rounded-2xl h-2 flex items-center overflow-hidden">
                        <div
                            style={{ width: progressPercentage + "%" }}
                            className="absolute left-0 h-2 bg-black rounded-2xl animation-all duration-1000 ease-in-out border border-black border-solid"
                        />
                    </div>

                    <div className="w-full flex justify-between text-xs">
                        <span>{displaySong.time || "0:00"}</span>
                        {displaySong.isplaying ? (
                            <Pause
                                className="h-10"
                                onClick={() =>
                                    tooglePlayerState(props.token, false)
                                }
                            />
                        ) : (
                            <Play
                                className="h-10"
                                onClick={() =>
                                    tooglePlayerState(props.token, true)
                                }
                            />
                        )}
                        <span>{displaySong.duration}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerComponent;
