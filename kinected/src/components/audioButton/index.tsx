"use client";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Palm from "../../icons/Palm.svg";
import Attention from "../../icons/Error badge.svg";
import { motion } from "framer-motion";

type Props = {
  isTooLoud?: boolean;
  isRecording: boolean;
  onClick: () => void;
  currentTime?: string;
};

export default function AudioButton(props: Props) {
  const [size, setSize] = useState(0);

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.AudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const update = () => {
        analyser.getByteTimeDomainData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = (dataArray[i] - 128) / 128.0;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / bufferLength);
        setSize(rms * 100);

        requestAnimationFrame(update);
      };

      update();
    });
  }, []);

  return (
    <div
      onClick={props.onClick}
      className="w-full h-24 flex justify-center items-center"
    >
      <div className="size-24 rounded-full flex justify-center items-center relative z-[100000000]">
        <div
          className={twMerge(
            "absolute top-1/2 left-1/2 bg-red-500 -translate-x-1/2 -translate-y-1/2",
            " -z-[10] animate-all duration-500 ease-in-out",
            props.isRecording
              ? "w-1/3 h-1/3 rounded-[25%]"
              : "w-full h-full rounded-[100%]",
          )}
        />
        <div className="-z-[100] w-full h-full rounded-full absolute bg-black" />

        <div
          style={{
            width: `${100 + size * 1.25}px`,
            height: `${100 + size * 1.25}px`,
          }}
          className="absolute bg-white animate-all duration-[50ms] rounded-full -z-[1000] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <Palm
          className={twMerge(
            "transition-all duration-500",
            props.isRecording ? "w-0 h-0 opacity-0" : "w-10 h-10 opacity-100",
          )}
        />
        {props.currentTime && (
          <span className="text-white absolute -right-32 font-medium text-sm font-light">
            {props.currentTime} / 0:02
          </span>
        )}
        {props.isTooLoud && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-white text-sm font-light text-xl absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap flex gap-2 items-center"
          >
            <Attention className="size-8" />
            Il y a beaucoup de bruit ambiant
          </motion.div>
        )}
      </div>
      {/* <div
                style={{
                    width: `${72 + size * 1.25}px`,
                    height: `${72 + size * 1.25}px`,
                }}
                className={twMerge(
                    "bg-white animate-all rounded-full duration-[50ms] relative"
                )}
            >
                <div className="size-24 rounded-full bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-2 p-1 relative">
                    <div
                        onClick={() => props.onClick()}
                        className={twMerge(
                            "animate-all duration-500",
                            "flex items-center justify-center",
                            props.isRecording
                                ? "w-1/2 h-1/2 bg-red-500 rounded-[25%]"
                                : "w-full h-full bg-red-500 rounded-[100%]"
                        )}
                    >
                        <Palm
                            className={twMerge(
                                "transition-all duration-500",
                                props.isRecording
                                    ? "w-0 h-0 opacity-0"
                                    : "w-6 h-6 opacity-100"
                            )}
                        />
                    </div>
                </div>
            </div> */}
    </div>
  );
}
