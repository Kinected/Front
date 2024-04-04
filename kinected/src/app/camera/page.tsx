"use client";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

export default function WebcamCapture() {
    const webcamRef = React.useRef<Webcam>(null);
    const [deviceId, setDeviceId] = useState<string>();

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            const videoDevices = devices.filter(
                (device) => device.kind === "videoinput"
            );
            if (videoDevices[1]) {
                setDeviceId(videoDevices[1].deviceId);
            }
        });
    }, []);

    const capture = React.useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            console.log(imageSrc);
            fetch("http://localhost:8000/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image: imageSrc }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }, [webcamRef]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <span className="text-white text-4xl font-bold">
                Créer un profil
            </span>
            <div className="flex w-3/4 aspect-square flex-col bg-white rounded-2xl p-4">
                <div className="relative w-full h-full">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        mirrored={true}
                        videoConstraints={{ deviceId: deviceId }}
                        screenshotFormat="image/jpeg"
                        className="absolute object-cover w-full h-full rounded-2xl top-0 left-0"
                    />
                    <div
                        onClick={capture}
                        className="absolute bottom-4 shadow border-solid border-4 border-white left-1/2 -translate-x-1/2 size-12 rounded-full"
                    />
                </div>
            </div>
        </div>
    );
}
