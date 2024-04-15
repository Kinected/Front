"use client";
import React, { useEffect } from "react";
import Webcam from "react-webcam";
import Palm from "../../icons/Palm.svg";
import { useRouter } from "next/navigation";
import Attention from "../../icons/Error badge.svg";
import { useUserActionsStore } from "@/stores/gestures.store";

export default function WebcamCapture() {
  const webcamRef = React.useRef<Webcam>(null);
  const router = useRouter();

  const [isCreatingProfile, setIsCreatingProfile] = React.useState(false);

  const capture = React.useCallback(() => {
    setIsCreatingProfile(true);
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot({
        width: 1920,
        height: 1080,
      });
      fetch("http://localhost:8000/api/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageSrc }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("data", data);
          if (data.success === true) {
            router.push("/audio/user/change-name");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    setIsCreatingProfile(false);
  }, [webcamRef]);

  const updateEffectsOnAction = useUserActionsStore(
    (state) => state.updateEffectsOnAction,
  );

  useEffect(() => {
    updateEffectsOnAction({
      click: () => capture(),
      up: () => {
        console.log("isCreatingProfile", isCreatingProfile);
        !isCreatingProfile && router.push("/");
        console.log("up");
      },
    });
  }, [isCreatingProfile]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col text-white w-3/4 items-center gap-2">
        <span className="text-5xl font-bold">Nouveau visage detecté !</span>
        <span className="text-2xl font-medium text-center">
          Prenez une photo de votre visage pour créer un profil
        </span>
      </div>
      <div className="flex-1 w-3/4 bg-white rounded-3xl flex flex-col gap-4 justify-between p-4">
        <div className="flex h-full w-full flex-col bg-white rounded-3xl">
          <div className="relative w-full h-full">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotQuality={1}
              mirrored
              imageSmoothing={false}
              videoConstraints={{
                width: 1920,
                height: 1080,
              }}
              screenshotFormat="image/jpeg"
              className="absolute object-cover w-full h-full rounded-2xl top-0 left-0"
            />
            <div className="rounded-2xl absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent" />
            <div
              onClick={capture}
              className="active:scale-110 animation-all duration-100 absolute bottom-8 shadow border-solid border-8 border-white left-1/2 -translate-x-1/2 size-24 rounded-full flex items-center justify-center"
            >
              <Palm className="size-12 text-white" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-3/4 bg-white rounded-2xl p-4 gap-2">
        <div className="flex gap-2 items-center">
          <Attention className="size-8" />
          <span className="text-xl font-medium">
            Conseils d&apos;utilisation :
          </span>
        </div>
        <div className="flex flex-1 gap-4">
          <div className="flex flex-1 flex-col">
            <span className="text-md">- Regarder la camera</span>
            <span className="text-md">
              - Ne pas mettre la main devant le visage
            </span>
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-md ">- Ne pas faire de contre-jour</span>
            <span className="text-md">- Ne pas porter de lunettes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
