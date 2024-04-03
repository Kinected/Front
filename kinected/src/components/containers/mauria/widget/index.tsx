import React from "react";
import Mauria from "@/../public/Mauria.svg";
import { useQuery } from "react-query";
// import { format, parseISO } from "date-fns";
import { nanoid } from "nanoid";
import { fetchMauriaPlanning } from "@/utils/getPlanning";
import { motion } from "framer-motion";

export default function MauriaWidget() {
    const {
        data: planning,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["mauria", "planning"],
        queryFn: async () => {
            return await fetchMauriaPlanning();
        },
    });

    function isSameDay(dateStr: string, isTomorrow: boolean) {
        const today = new Date();
        const tomorrow = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1
        );

        const compareDate = isTomorrow ? tomorrow : today;

        const date = new Date(dateStr);

        return (
            compareDate.getFullYear() === date.getFullYear() &&
            compareDate.getMonth() === date.getMonth() &&
            compareDate.getDate() === date.getDate()
        );
    }
    if (!planning || isLoading || isError) return null;

    // console.log(planning);

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
            className="min-w-64 max-h-48 p-2 bg-white rounded-2xl flex flex-col gap-2"
        >
            <div className="flex justify-between items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                    <Mauria className="w-6 h-6" />
                </div>
                <span className="font-medium text-lg">
                    {todaysCourses.length !== 0
                        ? "Aujourd'hui"
                        : tomorrowsCourses.length !== 0
                          ? "Demain"
                          : "Lets go!"}
                </span>
            </div>
            <div className="flex flex-col gap-2">
                {displayCourses.map((course: any) => {
                    const start = new Date(course.start);
                    const end = new Date(course.end);

                    return (
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
                    );
                })}
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
    <div className="px-2 py-1 w-full h-12 rounded-2xl flex justify-between items-center gap-4 bg-white border border-solid border-black">
        <div className="flex flex-col items-center">
            <span className="text-sm whitespace-nowrap leading-tight">
                {props.start}
            </span>
            <span className="text-sm whitespace-nowrap leading-tight">
                {props.end}
            </span>
        </div>
        <div className="flex flex-col items-end w-fit">
            <span className="text-sm truncate">{props.title}</span>
            <span className="font-thin text-sm truncate">{props.room}</span>
        </div>
    </div>
);
