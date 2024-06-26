"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { putFirstname } from "@/utils/requests/user/put-firstname";
import { useFaceStore } from "@/stores/faces.store";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import AudioButton from "@/components/audioButton";
import { getTranscription } from "@/utils/requests/whisper/audio-transcription";
import { useUserActionsStore } from "@/stores/gestures.store";

export default function AudioChangeNameUser() {
  const [isRecording, setIsRecording] = useState(false);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const userID = useFaceStore((state) => state.userID);
  const router = useRouter();

  const [name, setName] = useState<null | string>(null);

  const [isUserTalked, setIsUserTalked] = useState(false);

  const [average, setAverage] = useState(0);

  const THRESHOLD = 25;

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

        if (name) {
          updateEffectsOnAction({
            left: () => ConfirmFirstname(),
            right: () => setName(null),
            up: () => router.push("/"),
          });
        } else {
          updateEffectsOnAction({
            click: () => {
              console.log("click");
              toggleRecording();
            },
            up: () => router.push("/"),
          });
        }
      })
      .catch((err) => console.error("Error: ", err));
  }, [name]);

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

  const toggleRecording = () => {
    console.log("toggleRecording");

    console.log("isRecording", isRecording);
    console.log("mediaRecorder", mediaRecorder);
    if (!isRecording && mediaRecorder) {
      console.log("start");
      setIsRecording((prev) => !prev);
      mediaRecorder.start();
    }
  };

  const sendAudio = (audioBlob: Blob) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (reader.result) {
        const formData = new FormData();
        formData.append("audio", new Blob([reader.result]), "audio.mp3");
        const data = await getTranscription(formData);
        let name = data.transcription.replace(/[^a-zA-Z0-9 ]/g, "") as string;
        name = name.split(" ")[0];

        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

        setName(formattedName);
      }
    };
    reader.readAsArrayBuffer(audioBlob);
  };

  async function ConfirmFirstname() {
    if (!name) return;
    const data = await putFirstname(name, userID as string);
    if (data.success) {
      router.push("/");
    }
  }

  const updateEffectsOnAction = useUserActionsStore(
    (state) => state.updateEffectsOnAction,
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <AnimatePresence>
        {name && (
          <Modal onCancel={() => setName(null)} onConfirm={ConfirmFirstname}>
            <div className="flex max-w-[75%] flex-col items-center">
              <span className="text-white text-5xl font-medium text-center ">
                Vous souhaitez être appellé...
              </span>
              <span className="text-white text-7xl font-bold">
                &quot;{name}&quot; ?
              </span>
            </div>
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!name && (
          <motion.div className="flex max-w-[75%] flex-col gap-8">
            <span className="text-6xl font-bold text-white text-center">
              Comment souhaitez-vous que l&apos;on vous appelle ?
            </span>
            <AudioButton
              isTooLoud={average > THRESHOLD * 1.25 && !isRecording}
              isRecording={isRecording}
              onClick={toggleRecording}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
