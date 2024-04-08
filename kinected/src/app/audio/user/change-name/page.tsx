"use client";
import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import Palm from "@/../public/Palm.svg";
import { tooglePlayerState } from "@/utils/requests/spotify/pause";
import { AnimatePresence, motion } from "framer-motion";
import { putFirstname } from "@/utils/requests/user/put-firstname";
import { useFaceStore } from "@/stores/faces.store";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import AudioButton from "@/components/audioButton";
import { getTranscription } from "@/utils/requests/whisper/audio-transcription";

export default function AudioChangeNameUser() {
    const [isRecording, setIsRecording] = useState(false);

    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
        null
    );
    const userID = useFaceStore((state) => state.userID);
    const router = useRouter();

    const [name, setName] = useState<null | string>(null);

    const [isUserTalked, setIsUserTalked] = useState(false);

    const [average, setAverage] = useState(0);

    const treshhold = 25;

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
        const reader = new FileReader();
        reader.onloadend = async () => {
            if (reader.result) {
                const formData = new FormData();
                formData.append(
                    "audio",
                    new Blob([reader.result]),
                    "audio.mp3"
                );
                console.log("Send Audio size:", formData);
                const data = await getTranscription(formData);
                console.log("Data:", data);
                let name = data.transcription.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ""
                ) as string;
                name = name.split(" ")[0];
                console.log("Name:", name);

                const formattedName =
                    name.charAt(0).toUpperCase() + name.slice(1);

                setName(formattedName);

            }
        };
        reader.readAsArrayBuffer(audioBlob);
    };

    async function ConfirmFirstname() {
        if (!name) return;
        const data = await putFirstname(name, userID as string);
        if (data.success == true) {
            router.push("/");
        }
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <AnimatePresence>
                {name && (
                    <Modal
                        onCancel={() => setName(null)}
                        onConfirm={ConfirmFirstname}
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-white text-5xl font-medium">
                                Votre nom est ...
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
                    <motion.div className="flex flex-col gap-8">
                        <span className="text-6xl font-bold text-white">
                            Quel est votre nom?
                        </span>
                        <AudioButton
                            isTooLoud={
                                average > treshhold * 1.25 && !isRecording
                            }
                            isRecording={isRecording}
                            onClick={() => toggleRecording(2000)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

{
    /* <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-1/2 bg-white rounded-2xl flex flex-col p-4 px-8 gap-8"
                    >
                        <div className="flex flex-col">
                            <span className="text-xl font-medium">
                                Comment vous appelez-vous ?
                            </span>
                            <span className="font-light text-sm">
                                Declenchez l&apos;enregistrement et prononcez
                                votre prénom
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="w-full rounded-full h-3 bg-gray-100 border border-solid border-gray-200 overflow-hidden">
                                <div
                                    className={twMerge(
                                        "h-full bg-black rounded-full animation-all duration-100"
                                    )}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between bg-white">
                                <span className="font-light text-xs">
                                    {time}
                                </span>
                                <AudioButton
                                    isRecording={isRecording}
                                    onClick={() => toggleRecording(2000)}
                                />

                                <span className="font-light text-xs">0:02</span>
                            </div>
                        </div>
                    </motion.div> */
}
