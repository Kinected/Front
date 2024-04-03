import React from "react";
import Image from "next/image";
import Arrow from "@/../public/arrow.svg";
import { twMerge } from "tailwind-merge";

type Props = {
    position: "left" | "center" | "right";
    cover: string;
    onClick?: () => void;
};

export default function CarouselItem(props: Props) {
    return (
        <div
            className={twMerge(
                props.position === "center" &&
                    "max-w-1/2 left-1/2 max-h-full h-full -translate-x-1/2",
                props.position === "left" &&
                    "max-w-1/3 left-0 max-w-xs max-h-full h-3/4 -translate-x-1/2",
                props.position === "right" &&
                    "max-w-1/3 right-0 max-w-xs max-h-full h-3/4 translate-x-1/2",
                "absolute aspect-square bg-white rounded-2xl flex justify-center items-center",
                "border-4 border-white border-solid",
                props.position !== "center" &&
                    "hover:scale-110 animation-all  duration-500"
            )}
        >
            <Image
                src={props.cover}
                fill
                className="fit-cover rounded-2xl"
                alt="cover current song"
            />

            {props.position !== "center" && (
                <div className="relative w-full h-full">
                    <div
                        className={twMerge(
                            props.position === "left" &&
                                "right-0 translate-x-1/2",
                            props.position === "right" &&
                                "left-0 -translate-x-1/2",
                            "absolute top-1/2 -translate-y-1/2",
                            "w-10 h-10 bg-white shadow rounded-full ",
                            "flex items-center justify-center",
                            "hover:scale-125 animation-all duration-500 "
                        )}
                    >
                        <Arrow
                            className={twMerge(
                                "h-6",
                                props.position === "left" && "rotate-180 ml-1",
                                props.position === "right" && "mr-1"
                            )}
                            onClick={() => props.onClick && props.onClick()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}