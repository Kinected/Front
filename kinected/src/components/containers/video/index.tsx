"use client";
import React from "react";
import Webcam from "react-webcam";

export default function WebcamCapture() {
    const webcamRef = React.useRef<Webcam>(null);

    const capture = React.useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            console.log(imageSrc);
        }
    }, [webcamRef]);

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="flex h-full aspect-square flex-col bg-white rounded-2xl p-4">
                <div className="relative w-full h-full">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="absolute object-cover w-full h-full rounded-2xl top-0 left-0"
                    />
                    <div className="absolute bottom-4 shadow border-solid border-4 border-white left-1/2 -translate-x-1/2 size-12 rounded-full" />
                </div>
            </div>
        </div>
    );
}
