import React from "react";
import Mauria from "../../../icons/Mauria.svg";
import { useQuery, useQueryClient } from "react-query";
// import { format, parseISO } from "date-fns";
import { nanoid } from "nanoid";
import {
  fetchMauriaPlanning,
  fetchUpdatedMauriaPlanning,
} from "@/utils/requests/mauria/getPlanning";
import { motion } from "framer-motion";
import { useFaceStore } from "@/stores/faces.store";
import { isSameDay } from "@/utils/other/isSameDay";
import { twMerge } from "tailwind-merge";

type Props = {
  onClick: () => void;
  isHover: boolean;
};

export default function MauriaWidget(props: Props) {
  const userID = useFaceStore((state) => state.userID);
  const queryClient = useQueryClient();

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

  const {
    data: planning,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["mauria", "planning", userID],
    queryFn: async () => {
      return await fetchMauriaPlanning(userID as string);
    },
    enabled: !!userID,
  });

  if (!planning || isLoading || isError) return null;

  const todaysCourses = planning.filter((course: any) => {
    return isSameDay(course.start, false);
  });

  const tomorrowsCourses = planning.filter((course: any) => {
    return isSameDay(course.start, true);
  });

  const displayCourses =
    todaysCourses.length === 0 ? tomorrowsCourses : todaysCourses;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.3 } }}
      exit={{ opacity: 0 }}
      className={twMerge(
        "min-w-64 h-48 p-3 bg-white rounded-2xl flex flex-col gap-2",
        "origin-bottom-right transition-all duration-500 relative",
        "after:absolute after:top-0 after:left-0 after:-z-10",
        "after:bg-white after:rounded-2xl",
        "after:transition-all after:duration-500",
        "after:w-full after:h-full",
        props.isHover &&
          "scale-110 after:opacity-40 after:rounded-2xl after:outline after:outline-offset-0 after:outline-8 after:outline-white -translate-y-1 -translate-x-1",
      )}
    >
      <div className="flex justify-between items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
          <Mauria className="w-6 h-6" />
        </div>
        <span className="font-medium text-lg pr-2">
          {todaysCourses.length !== 0
            ? "Aujourd'hui"
            : tomorrowsCourses.length !== 0
              ? "Demain"
              : "Lets go!"}
        </span>
      </div>
      <div className="flex flex-col">
        {displayCourses.slice(0, 2).map((course: any, index: number) => {
          const start = new Date(course.start);
          const end = new Date(course.end);

          return (
            <React.Fragment key={index}>
              <div className="border-b-2 border-gray-200" />
              <Line
                key={nanoid()}
                title={course.title.split("\n")[2]}
                room={course.title.split("\n")[0]}
                start={start.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                end={end.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
            </React.Fragment>
          );
        })}
        <div className="border-b-2 border-gray-200" />
        {displayCourses.length - 2 > 0 ? (
          <span className="px-2 py-1 text-sm text-center">
            Et {displayCourses.length - 2} autres cours...
          </span>
        ) : (
          <span className="px-2 py-1 text-sm text-center">
            C'est tout pour le moment
          </span>
        )}
        {displayCourses.length === 0 && (
          <span className="text-sm font-medium">
            Pas de cours prévus pour le moment
          </span>
        )}
      </div>
    </motion.div>
  );
}

type LineProps = {
  title: string;
  room: string;
  start: string;
  end: string;
};

const Line = (props: LineProps) => (
  <div className="px-1 w-full h-12 flex justify-between items-center gap-4">
    <div className="flex flex-col items-center">
      <span className="text-sm whitespace-nowrap leading-tight">
        {props.start}
      </span>
      <span className="text-sm whitespace-nowrap leading-tight">
        {props.end}
      </span>
    </div>
    <div className="flex flex-col items-end w-fit">
      <span className="text-sm truncate font-medium">{props.title}</span>
      <span className="text-sm truncate opacity-50">{props.room}</span>
    </div>
  </div>
);
