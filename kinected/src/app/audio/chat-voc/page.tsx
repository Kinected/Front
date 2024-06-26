"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AudioButton from "@/components/audioButton";
import { getResponse } from "@/utils/requests/whisper/audio-chatbot";
import pako from "pako";
import { useUserActionsStore } from "@/stores/gestures.store";
import { useRouter } from "next/navigation";
import Loader from "@/icons/Loader.svg";
import { useFaceStore } from "@/stores/faces.store";

export default function AudioChatVocUser() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserTalked, setIsUserTalked] = useState(false);
  const userID = useFaceStore((state) => state.userID);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [average, setAverage] = useState(0);
  const THRESHOLD = 25;

  const [response, setResponse] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);

  const updateEffectsOnAction = useUserActionsStore(
    (state) => state.updateEffectsOnAction,
  );

  useEffect(() => {
    if (!userID) {
      console.error("User ID not found");
      return;
    }

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

        const toggleRecording = () => {
          if (!isRecording && newMediaRecorder.state === "inactive") {
            setIsRecording(() => true);
            newMediaRecorder.start();
          } else {
            newMediaRecorder.stop();
            setIsUserTalked(() => true);
            setIsRecording(() => false);
          }
        };

        updateEffectsOnAction({
          click: toggleRecording,
          up: () => {
            router.push("/");
          },
        });
      })
      .catch((err) => console.error("Error: ", err));
  }, [userID]);

  useEffect(() => {
    if (!isUserTalked && average > THRESHOLD * 1.5 && isRecording) {
      setIsUserTalked(true);
    } else if (average < THRESHOLD && isRecording && isUserTalked) {
      setTimeout(() => {
        if (!mediaRecorder) return;
        mediaRecorder.stop();
        setIsRecording(false);
        setIsUserTalked(false);
      }, 1000);
    }
  }, [isRecording, isUserTalked, average]);

  const sendAudio = (audioBlob: Blob) => {
    console.log("Audio size:", audioBlob.size);
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (reader.result) {
        const formData = new FormData();
        formData.append("audio", new Blob([reader.result]), "audio.mp3");

        try {
          const data = await getResponse(formData, userID as string);
          setQuestion(() => data.question);
          setResponse(() => data.response);
          setIsLoading(() => false);
          await fetchAudioTranscription();
        } catch (error) {
          window.alert(error);
          setIsLoading(() => false);
        }
      }
    };
    setIsLoading(() => true);
    reader.readAsArrayBuffer(audioBlob);
  };

  const fetchAudioTranscription = async () => {
    console.log("Fetching audio transcription...");
    const response = await fetch(
      "http://localhost:8000/api/whisper/audio/transcription",
    );
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

    // Now you can use audioUrl to play the audio
    // For example, you can set it as the src of an audio element
    const audioElement = document.querySelector("audio");
    if (audioElement) {
      audioElement.src = audioUrl;
      audioElement.oncanplay = () => {
        audioElement.play();
      };
      audioElement.onerror = (error) => {
        console.error("Audio error:", error);
      };
      audioElement.onplaying = () => {};
    } else {
      console.error("feur");
    }

    setIsLoading(() => false);
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

  // useEffect(() => {
  //   updateEffectsOnAction({
  //     click: () => toggleRecording(mediaRecorder),
  //     up: () => {
  //       router.push("/");
  //     },
  //   });
  // }, []);

  return (
    <motion.div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col gap-24 items-center">
        {!isLoading && (
          <div className="flex flex-col gap-8">
            <span className="text-6xl font-bold text-white">
              Quelle est votre question ?
            </span>
            <AudioButton
              isTooLoud={average > THRESHOLD * 1.5 && !isRecording}
              isRecording={isRecording}
              onClick={() => {}}
            />
          </div>
        )}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1max-w-[75%] bg-white rounded-2xl p-8 flex flex-col gap-4"
            >
              <div className="flex flex-col gap-4 items-center w-64">
                <span className="text-black font-medium text-2xl">
                  <Loader className={"size-40 animate-spin"} />
                </span>
                <span className="text-black text-xl text-center">
                  Chargement en cours...
                </span>
              </div>
            </motion.div>
          )}
          {!isLoading && question && response && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 w-full max-w-[75%] bg-white rounded-2xl p-4 px-8 flex flex-col gap-4"
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
