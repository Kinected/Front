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

export default function AudioChangeNameUser() {
    const [isRecording, setIsRecording] = useState(false);
    const [progress, setProgress] = useState(0);
    const recordingTimeout = useRef<ReturnType<typeof setInterval> | null>(
        null
    );
    const [time, setTime] = useState("0:00");

    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
        null
    );
    const userID = useFaceStore((state) => state.userID);
    const router = useRouter();

    const [name, setName] = useState<null | string>(null);
    // const [chunks, setChunks] = useState<BlobPart[]>([]);
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
                formData.append(
                    "audio",
                    new Blob([reader.result]),
                    "audio.mp3"
                );
                console.log("Sending audio...");
                console.log("Audio size:", formData);

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
                    setName(data.firstname);
                } catch (error) {
                    console.error("Error sending audio:", error);
                }
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
                            currentTime={time}
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
