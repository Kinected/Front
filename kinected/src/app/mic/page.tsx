"use client";
import React, { useEffect, useState } from "react";

export default function MicCapture() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [chunks, setChunks] = useState<BlobPart[]>([]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (e) => {
          setChunks((prev) => [...prev, e.data]);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/mp3" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "name.mp3";
          a.click();
        };

        setTimeout(() => {
          recorder.start();
          setTimeout(() => {
            recorder.stop();
          }, 5000);
        }, 5000);
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
            ref={(audioElement) => {
              if (
                audioElement &&
                mediaRecorder &&
                mediaRecorder.state === "inactive"
              ) {
                audioElement.src = URL.createObjectURL(
                  new Blob(chunks, { type: "audio/mp3" })
                );
              }
            }}
            className="absolute object-cover w-full h-full rounded-2xl top-0 left-0"
          />
        </div>
      </div>
    </div>
  );
}
