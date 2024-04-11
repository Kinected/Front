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

  const isRunning = useTeethTimerStore((state) => state.isRunning);
  const time = useTeethTimerStore((state) => state.time);

  const { formattedTime, toggleTimer, resetTimer } = useTeethTimer({
    initialTime: time || 180,
    isDefaultRunning: isRunning || false,
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
      <div className={"flex flex-col items-center gap-8"}>
        <PageTitle>Minuteur de brossage de dent</PageTitle>

        <span className={"text-9xl font-bold"}>{formattedTime}</span>
      </div>

      <Button onClick={toggleTimer}>
        {isRunning ? "Arrêter" : "Lancer"} le minuteur
      </Button>
    </Page>
  );
};

export default TeethTimer;
