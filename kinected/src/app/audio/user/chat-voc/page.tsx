"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import Palm from "@/../public/Palm.svg";
import { tooglePlayerState } from "@/utils/requests/spotify/pause";
import { AnimatePresence, motion } from "framer-motion";
import { useFaceStore } from "@/stores/faces.store";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import AudioButton from "@/components/audioButton";
import { getResponse } from "@/utils/requests/whisper/audio-chatbot";
import pako from "pako";

export default function AudioChatVocUser() {
  const [isRecording, setIsRecording] = useState(false);
  const [isUserTalked, setIsUserTalked] = useState(false);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [average, setAverage] = useState(0);
  const treshhold = 25;

  const [response, setResponse] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);

        const newMediaRecorder = new MediaRecorder(stream);
        setMediaRecorder(newMediaRecorder);

        newMediaRecorder.ondataavailable = (e) => {
          console.log("Data available");
          if (newMediaRecorder.state === "inactive") {
            sendAudio(new Blob([e.data], { type: "audio/mp3" }));
          }
        };

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkAudio = () => {
          analyser.getByteFrequencyData(dataArray);
          const sum = dataArray.reduce((a, b) => a + b);
          setAverage(sum / dataArray.length);
          requestAnimationFrame(() => checkAudio());
        };

        checkAudio();
      })
      .catch((err) => console.error("Error: ", err));
  }, []);

  useEffect(() => {
    if (!isUserTalked && average > treshhold * 1.5 && isRecording) {
      setIsUserTalked(true);
    } else if (average < treshhold && isRecording && isUserTalked) {
      setTimeout(() => {
        if (!mediaRecorder) return;
        mediaRecorder.stop();
        setIsRecording(false);
        setIsUserTalked(false);
      }, 1000);
    }
  }, [isRecording, isUserTalked, average]);

  const toggleRecording = (milis: number) => {
    if (!isRecording && mediaRecorder) {
      setIsRecording((prev) => !prev);
      mediaRecorder.start();
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

        const data = await getResponse(formData);
        setResponse((a) => data.response);
        setQuestion((a) => data.question);
        await fetchAudioTranscription();
      }
    };
    reader.readAsArrayBuffer(audioBlob);
  };

  const fetchAudioTranscription = async () => {
    console.log("Fetching audio transcription...");
    const response = await fetch("http://localhost:8000/api/audio/transcription");
    const data = await response.json();
    const audioBase64 = data.audio;

    // Decode base64
    const byteCharacters = atob(audioBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Decompress gzip
    const decompressedData = pako.inflate(byteArray.buffer);
    const audioBlob = new Blob([decompressedData], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(audioBlob);
    console.log("Audio URL:", audioUrl);

    // Now you can use audioUrl to play the audio
    // For example, you can set it as the src of an audio element
    const audioElement = document.querySelector("audio");
    console.log("audioElement", audioElement);
    if (audioElement) {
      audioElement.src = audioUrl;
      console.log("Audio element src:", audioElement.src);
      audioElement.oncanplay = () => {
        audioElement.play();
      };
      audioElement.onerror = (error) => {
        console.error("Audio error:", error);
      };
      audioElement.onplaying = () => {
        console.log("Audio is playing");
      };
    } else {
      console.error("feur");
    }
  };

  function AudioHP() {
    const audioRef = useRef(null);

    useEffect(() => {
      const audioElement = audioRef.current;
      // console.log("audioElement", audioElement);
      // Vous pouvez maintenant utiliser audioElement pour contrôler la lecture audio
    }, []);

    return <audio ref={audioRef} />;
  }

  return (
    <motion.div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col gap-24 items-center">
        <div className="flex flex-col gap-8">
          <span className="text-6xl font-bold text-white">
            Quelle est votre question ?
          </span>
          <AudioButton
            isTooLoud={average > treshhold * 1.5 && !isRecording}
            isRecording={isRecording}
            onClick={() => toggleRecording(5000)}
          />
        </div>
        <AnimatePresence>
          {question && response && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 max-w-[75%] bg-white rounded-2xl p-4 px-8 flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <span className="text-black font-medium text-2xl">
                  Retranscription :
                </span>

                <span className="text-black text-xl">{question}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-black font-medium text-2xl">
                  Réponse :
                </span>
                <span className="text-black text-xl">{response}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AudioHP />
    </motion.div>
  );
}
