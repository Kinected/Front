import { useEffect, useState } from "react";
import Pause from "@/../public/Pause.svg";

type Props = {
    song: Song;
};

type Song = {
    artist: string;
    track: string;
    cover: string;
    time: string;
    duration: string;
    progress: number;
};

const PlayerComponent = (props: Props) => {
    const progressPercentage = props.song.progress * 100;

    return (
        <div className="flex justify-center items-center">
            <div className="w-1/2 bg-white rounded-2xl flex flex-col items-center justify-between p-4 px-12">
                <div className="flex flex-col gap-1 w-full items-center">
                    <span className="truncate w-full text-start ">
                        {props.song?.artist} - {props.song?.track}
                    </span>
                    <div className="relative w-full border border-gray-200 bg-gray-100 border-solid rounded-2xl h-2 flex items-center overflow-hidden">
                        <div
                            style={{ width: progressPercentage + "%" }}
                            className="absolute left-0 h-2 bg-black rounded-2xl"
                        />
                    </div>
                    <div className="w-full flex justify-between text-xs">
                        <span>{props.song?.time}</span>
                        <span>{props.song?.duration}</span>
                    </div>
                </div>
                <Pause className="h-10" />
            </div>
        </div>
    );
};

export default PlayerComponent;
