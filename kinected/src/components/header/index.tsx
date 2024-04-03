import React, { useEffect, useState } from "react";
import Button from "../button";
import { useRouter } from "next/navigation";
import Apps from "@/../public/apps.svg";
import Weather from "../containers/weather";
import ListeningFeedback from "@/components/Feedbacks/ListeningFeedback";
import { useGesturesStore } from "@/stores/gestures.store";

type HeaderProps = {};

export default function Header(props: HeaderProps) {
  const [time, setTime] = useState(new Date());

  const hand = useGesturesStore((state) => state.hand);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex justify-between">
      <div className="flex-1">
        <Button className="origin-top-left">
          <Apps className="w-8 h-8" />
          Apps
        </Button>
      </div>

      <div className="flex-1 flex flex-col">
        <span className="text-white text-2xl text-center font-light capitalize">
          {time.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </span>
        <span className="text-white text-8xl text-center font-bold">
          {`${time.getHours().toString().padStart(2, "0")}:${time
            .getMinutes()
            .toString()
            .padStart(2, "0")}`}
        </span>

        <ListeningFeedback hand={hand} />
      </div>

      <div className="flex-1 flex justify-end items-start">
        <Weather />
      </div>
    </div>
  );
}