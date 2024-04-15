"use client";

import React, { useEffect } from "react";
import Page from "@/components/Layout/Page";
import PageTitle from "@/components/Layout/PageTitle";
import Button from "@/components/button";
import { useUserActionsStore } from "@/stores/gestures.store";
import { useRouter } from "next/navigation";
import { useTeethTimerStore } from "@/stores/teethTimer.store";

const TeethTimer = () => {
  const router = useRouter();

  const current_action = useUserActionsStore((state) => state.current_action);
  const updateEffectsOnAction = useUserActionsStore(
    (state) => state.updateEffectsOnAction,
  );

  const { time, formatTime, isRunning, isFinished, toggleIsRunning, resetTime } =
    useTeethTimerStore((state) => state);

  useEffect(() => {
    updateEffectsOnAction({
      down: () => resetTime(),
      click: () => toggleIsRunning(),
      up: () => router.push("/"),
    });
  }, []);

  return (
    <Page className={"items-center gap-24"}>
      <Button className={"w-fit"} isHover={current_action === "hover_down"}>
        Réinitialiser
      </Button>
      <div
        className={"flex flex-col items-center justify-center gap-24 flex-1"}
      >
        <div className={"flex flex-col items-center gap-8"}>
          <PageTitle>Minuteur de brossage de dent</PageTitle>
          {isFinished ? (
            <span className={"relative text-7xl font-bold animate-bounce mt-8"}>
              Minuteur Terminé !
            </span>
          ) : (
            <span className={"text-9xl font-bold"}>{formatTime(time)}</span>
          )}
        </div>

        {isFinished ? (
          <Button onClick={toggleIsRunning}>Réinitialiser le minuteur</Button>
        ) : (
          <Button onClick={toggleIsRunning}>
            {isRunning ? "Arrêter" : "Lancer"} le minuteur
          </Button>
        )}
      </div>

    </Page>
  );
};

export default TeethTimer;
