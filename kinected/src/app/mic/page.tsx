"use client";
import React from "react";
import { useEffect, useState } from "react";

export default function MicCapture() {
  const [audio, setAudio] = useState<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setAudio(stream);
      })
      .catch((err) => console.error("Error: ", err));
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <span className="text-white text-4xl font-bold">
        Quel est votre nom ?
      </span>
        <div className="flex h-full aspect-square flex-col bg-white rounded-2xl p-4">
            <div className="relative w-full h-full">
            <audio
                autoPlay
                controls
                ref={audioElement => {
                    if (audioElement) {
                        audioElement.srcObject = audio;
                    }
                }}
                className="absolute object-cover w-full h-full rounded-2xl top-0 left-0"
            />
            </div>
        </div>
    </div>
  );
}
