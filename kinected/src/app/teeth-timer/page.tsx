"use client";

import React, { useEffect } from "react";
import Page from "@/components/Layout/Page";
import PageTitle from "@/components/Layout/PageTitle";
import Button from "@/components/button";
import { useUserActionsStore } from "@/stores/gestures.store";
import { useTeethTimer } from "@/hooks/useTeethTimer";
import { useRouter } from "next/navigation";
import { useTeethTimerStore } from "@/stores/teethTimerStore.store";

const TeethTimer = () => {
  const router = useRouter();

  const updateEffectsOnAction = useUserActionsStore(
    (state) => state.updateEffectsOnAction,
  );
  const isDefaultRunning = useTeethTimerStore((state) => state.isRunning);
  const time = useTeethTimerStore((state) => state.time);
  const current_action = useUserActionsStore((state) => state.current_action);

  const { formattedTime, isRunning, toggleTimer, resetTimer } = useTeethTimer({
    initialTime: time || 180,
    isDefaultRunning: isDefaultRunning || false,
  });

  useEffect(() => {
    updateEffectsOnAction({
      down: () => resetTimer(),
      click: () => toggleTimer(),
      up: () => router.push("/"),
    });
  }, []);

  return (
    <Page className={"items-center gap-24"}>
      <Button className={"w-fit"} isHover={current_action === "hover_down"}>Réinitialiser</Button>
      <div className={"flex flex-col items-center justify-center gap-24 flex-1"}>
        <div className={"flex flex-col items-center gap-8"}>
          <PageTitle>Minuteur de brossage de dent</PageTitle>
          <span className={"text-9xl font-bold"}>{formattedTime}</span>
        </div>

        <Button onClick={toggleTimer} >
          {isRunning ? "Arrêter" : "Lancer"} le minuteur
        </Button>
      </div>
    </Page>
  );
};

export default TeethTimer;
