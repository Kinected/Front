"use client";

import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import {
  fetchMauriaPlanning,
  fetchUpdatedMauriaPlanning,
} from "@/utils/requests/mauria/getPlanning";
import { useFaceStore } from "@/stores/faces.store";
import PageTitle from "../../components/Layout/PageTitle";
import Page from "../../components/Layout/Page";
import { useRouter } from "next/navigation";
import { useUserActionsStore } from "@/stores/gestures.store";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import FrLocale from "@fullcalendar/core/locales/fr";
import "./styles.scss";

import Loader from "@/icons/Loader.svg";

const LoadingContent = () => {
  return (
    <Page>
      <PageTitle>Votre Semaine:</PageTitle>

      <div className={"flex flex-1 justify-center items-center"}>
        <div
          className={
            "flex flex-col items-center justify-center h-fit gap-16 p-16 bg-white/25 rounded-3xl text-2xl"
          }
        >
          <span>Chargement en cours...</span>

          <Loader className={"size-40 animate-spin"} />
          <span>Un peu de patience</span>
        </div>
      </div>
    </Page>
  );
};

const ErrorContent = () => {
  return <div className={"text-white"}>Error...</div>;
};

const MauriaPage = () => {
  const userID = useFaceStore((state) => state.userID);
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateActionsOnSwipe = useUserActionsStore(
    (state) => state.updateEffectsOnAction,
  );

  useEffect(() => {
    updateActionsOnSwipe({
      up: () => router.push("/"),
    });
  }, []);

  useQuery({
    queryKey: ["mauria", "planning", "updated", userID],
    queryFn: async () => {
      return await fetchUpdatedMauriaPlanning(userID as string);
    },
    enabled: !!userID,
    onSuccess: (data) => {
      queryClient.setQueryData(["mauria", "planning", userID], data);
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["mauria", "planning", userID],
    queryFn: async () => {
      return await fetchMauriaPlanning(userID as string);
    },
    enabled: !!userID,
  });

  console.log("data", data, isLoading, isError);

  if (isLoading || !data) {
    return <LoadingContent />;
  }

  if (isError) {
    return <ErrorContent />;
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
