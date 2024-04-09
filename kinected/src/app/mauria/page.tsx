"use client";

import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { fetchUpdatedMauriaPlanning } from "@/utils/requests/mauria/getPlanning";
import { useFaceStore } from "@/stores/faces.store";
import PageTitle from "../../components/Layout/PageTitle";
import Page from "../../components/Layout/Page";
import { useRouter } from "next/navigation";
import { useUserActionsStore } from "@/stores/gestures.store";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import FrLocale from "@fullcalendar/core/locales/fr";

import type { ring } from "ldrs";
import "./styles.scss";

const LoadingContent = () => {
  return <div className={"text-white"}>Loading...</div>;
};

const ErrorContent = () => {
  return <div className={"text-white"}>Error...</div>;
};

const MauriaPage = () => {
  const userID = useFaceStore((state) => state.userID);
  const router = useRouter();
  const updateActionsOnSwipe = useUserActionsStore(
    (state) => state.updateEffectsOnAction,
  );

  useEffect(() => {
    updateActionsOnSwipe({
      up: () => router.push("/"),
    });
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["mauria", "planning", userID],
    queryFn: async () => fetchUpdatedMauriaPlanning(userID as string),

    enabled: !!userID,
    // 5 minutes
    cacheTime: 300000,
  });

  if (isLoading) {
    return (
      <Page>
        <PageTitle>Votre Semaine:</PageTitle>

        <div className={"flex flex-1 justify-center items-center"}>
          <div
            className={
              "flex flex-col items-center justify-center h-fit gap-16 p-16 bg-white/25 rounded-2xl"
            }
          >
            <span className={"text-xl"}>Chargement en cours...</span>

            <l-ring color="white" size={80} stroke={12}></l-ring>
            <span>Un peu de patience</span>
          </div>
        </div>
      </Page>
    );
  }

  if (isError || !data) {
    return <div className={"text-white"}>Error...</div>;
  }

  return (
    <Page className={"mx-auto w-full max-w-screen-md"}>
      <PageTitle>Votre Semaine:</PageTitle>
      <div className={"h-1/2"}>
        <div className={"w-full h-full rounded-2xl border-2 overflow-hidden"}>
          <FullCalendar
            events={data}
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            contentHeight={"100%"}
            height={"100%"}
            headerToolbar={{
              left: "",
              center: "",
              right: "",
            }}
            locale={FrLocale}
            allDaySlot={false}
            slotMinTime="07:00:00"
            slotMaxTime="20:00:00"
            weekends={false}
          />
        </div>
      </div>
    </Page>
  );
};

export default MauriaPage;
