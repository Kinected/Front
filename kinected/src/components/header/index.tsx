import React from "react";
import Button from "../button";
import { useRouter } from "next/navigation";
import Apps from "@/../public/apps.svg";
import Weather from "../containers/weather";

export default function Header() {
    const router = useRouter();

    return (
        <div className="flex justify-between">
            <div className="flex-1">
                <Button className="origin-top-left">
                    <Apps className="w-8 h-8" />
                    Apps
                </Button>
            </div>

            <div className="flex-1 flex flex-col">
                <span className="text-white text-2xl text-center font-light">
                    Lundi 12 Mars
                </span>
                <span className="text-white text-8xl text-center font-bold">
                    12:34
                </span>
            </div>

            <div className="flex-1 flex justify-end items-start">
                <Weather />
            </div>
        </div>
    );
}
