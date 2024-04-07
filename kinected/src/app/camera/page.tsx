"use client";
import React from "react";
import Webcam from "react-webcam";
import Palm from "@/../public/Palm.svg";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
    const webcamRef = React.useRef<Webcam>(null);
    const router = useRouter();

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
                .then((data) => {
                    if (data.success === true) {
                        console.log("User created");
                        router.push("/audio/user/change-name");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }, [webcamRef]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <div className="flex-1 w-3/4 bg-white rounded-2xl flex flex-col gap-4 justify-between p-4">
                <div className="flex flex-col leading-tight">
                    <span className="text-xl font-medium">
                        Nouveau visage detecté !
                    </span>
                    <span className="text-sm font-light">
                        Veuillez prendre une photo de votre visage pour créer
                        votre profil
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-light">
                        Conseils d&apos;utilisation :
                    </span>
                    <div className="flex flex-1 gap-4">
                        <div className="flex flex-col">
                            <span className="font-thin text-xs">
                                - Regarder la camera
                            </span>
                            <span className="font-thin text-xs">
                                - Ne pas mettre la main devant le visage
                            </span>
                        </div>
                        <div className="flex flex-1 flex-col">
                            <span className="font-thin text-xs ">
                                - Ne pas faire de contre-jour
                            </span>
                            <span className="font-thin text-xs">
                                - Ne pas porter de lunettes
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex h-full w-full flex-col bg-white rounded-2xl">
                    <div className="relative w-full h-full">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="absolute object-cover w-full h-full rounded-2xl top-0 left-0"
                        />
                        <div
                            onClick={capture}
                            className="absolute bottom-4 shadow border-solid border-[3px] border-white left-1/2 -translate-x-1/2 size-12 rounded-full flex items-center justify-center"
                        >
                            <Palm className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
