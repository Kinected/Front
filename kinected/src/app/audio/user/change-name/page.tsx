"use client";
import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import Palm from "@/../public/Palm.svg";
import { tooglePlayerState } from "@/utils/requests/spotify/pause";
import { AnimatePresence, motion } from "framer-motion";
import { putFirstname } from "@/utils/requests/user/put-firstname";
import { useFaceStore } from "@/stores/faces.store";
import { useRouter } from "next/navigation";

export default function AudioChangeNameUser() {
    const [size, setSize] = useState(0);
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
                    setName(data.firstname);
                } catch (error) {
                    console.error("Error sending audio:", error);
                }
            }
        };
        reader.readAsArrayBuffer(audioBlob);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <AnimatePresence>
                {name && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-3/4 bg-white rounded-2xl flex flex-col p-4 gap-4"
                    >
                        <span className="text-xl font-medium">
                            Vous vous appelez &quot;{name}&quot; ?
                        </span>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setName(null)}
                                className="w-1/2 bg-red-500 text-white rounded-lg p-2"
                            >
                                Non
                            </button>
                            <button
                                onClick={async () => {
                                    const data = await putFirstname(
                                        name,
                                        userID as string
                                    );
                                    if (data.success == true) {
                                        router.push("/");
                                    }
                                }}
                                className="w-1/2 bg-green-500 text-white rounded-lg p-2"
                            >
                                Oui
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {!name && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-3/4 bg-white rounded-2xl flex flex-col p-4 gap-8"
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
                                <div className="w-full h-24 flex justify-center items-center">
                                    <div
                                        style={{
                                            width: `${52 + size * 1.25}px`,
                                            height: `${52 + size * 1.25}px`,
                                        }}
                                        className={twMerge(
                                            "bg-black animate-all rounded-full duration-[50ms] relative"
                                        )}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-2 p-1 relative">
                                            <div
                                                onClick={() =>
                                                    toggleRecording(2000)
                                                }
                                                className={twMerge(
                                                    "animate-all duration-500",
                                                    "flex items-center justify-center",
                                                    isRecording
                                                        ? "w-1/2 h-1/2 bg-red-500 rounded-[25%]"
                                                        : "w-full h-full bg-red-500 rounded-[100%]"
                                                )}
                                            >
                                                <Palm
                                                    className={twMerge(
                                                        "transition-all duration-500",
                                                        isRecording
                                                            ? "w-0 h-0 opacity-0"
                                                            : "w-6 h-6 opacity-100"
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <span className="font-light text-xs">0:02</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
