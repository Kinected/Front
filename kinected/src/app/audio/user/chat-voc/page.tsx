"use client";
import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import Palm from "@/../public/Palm.svg";
import { tooglePlayerState } from "@/utils/requests/spotify/pause";
import { AnimatePresence, motion } from "framer-motion";
import { useFaceStore } from "@/stores/faces.store";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import AudioButton from "@/components/audioButton";

export default function AudioChatVocUser() {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const recordingTimeout = useRef<ReturnType<typeof setInterval> | null>(null);
  const [time, setTime] = useState("0:00");

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const userID = useFaceStore((state) => state.userID);
  const router = useRouter();
  const [response, setResponse] = useState<string | null>(null);

  const [question, setQuestion] = useState<string | null>(null);

  let chunks: BlobPart[] = [];

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

  const startRecording = () => {};

  const toggleRecording = (milis: number) => {
    if (!isRecording && mediaRecorder) {
      setIsRecording((prev) => !prev);
      chunks = []; // Reset chunks at the start of recording
      mediaRecorder.start();
      setProgress(0);
      const startTime = Date.now();
      recordingTimeout.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setProgress((elapsed / milis) * 100);
        setTime(`0:0${((elapsed % 60000) / 1000).toFixed(0)}`);
      }, 50) as NodeJS.Timeout;
      setTimeout(() => {
        setIsRecording(false);
        clearInterval(recordingTimeout.current ?? undefined);
        mediaRecorder.stop();
      }, milis);
    } else {
      clearInterval(recordingTimeout.current ?? undefined);
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

        try {
          const response = await fetch(
            `http://localhost:8000/api/audio/chatvoc?userID=${userID}`,
            {
              method: "POST",
              body: formData,
            }
          );
          const data = await response.json();
          console.log(data);
          setResponse((a) => data.response);
          setQuestion((a) => data.question);
        } catch (error) {
          console.error("Error sending audio:", error);
        }
      }
    };
    reader.readAsArrayBuffer(audioBlob);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center text-6xl font-bold text-white gap-10">
        <AnimatePresence>
          <>
            {question && <span key="question">{question}</span>}
            {response && <span key="answer">{response}</span>}
          </>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {!question && (
          <motion.div className="flex flex-col gap-8">
            <span className="text-6xl font-bold text-white">
              Quelle est votre question ?
            </span>
            <AudioButton
              currentTime={time}
              isRecording={isRecording}
              onClick={() => toggleRecording(5000)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
