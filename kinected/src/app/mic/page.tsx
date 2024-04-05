"use client";
import React, { useEffect, useState } from "react";

export default function MicCapture() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  // const [chunks, setChunks] = useState<BlobPart[]>([]);
  let chunks: BlobPart[] = [];
  const userID = "1";

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const newMediaRecorder = new MediaRecorder(stream);
        setMediaRecorder(newMediaRecorder);

        newMediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
          if (newMediaRecorder.state === "inactive") {
            sendAudio(new Blob(chunks, { type: "audio/mp3" }));
          }
        };
      })
      .catch((err) => console.error("Error: ", err));
  }, []);

  const startRecording = () => {
    if (mediaRecorder) {
      chunks = []; // Reset chunks at the start of recording
      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
      }, 2000);
    }
  };

  const sendAudio = (audioBlob: Blob) => {
    console.log("Audio size:", audioBlob.size);
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (reader.result) {
        const formData = new FormData();
        formData.append("audio", new Blob([reader.result]), "audio.mp3");
        console.log("Sending audio...");
        console.log("Audio size:", formData);
        // console.log("Audio size:", formData.get("audio")?.size);

        try {
          const response = await fetch(
            `http://localhost:8000/api/audio/firstname?userID=${userID}`,
            {
              method: "POST",
              body: formData,
            }
          );
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error("Error sending audio:", error);
        }
      }
    };
    reader.readAsArrayBuffer(audioBlob);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <span className="text-white text-4xl font-bold">
        Quel est votre nom ?
      </span>
      <div className="text-black text-l font-bold bg-white rounded-full p-2">
        <button onClick={startRecording}>Start Recording</button>
      </div>
      <div className="flex h-1/2 aspect-square flex-col bg-white rounded-2xl p-4">
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
