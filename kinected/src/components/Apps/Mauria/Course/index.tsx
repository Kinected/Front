import React from "react";
import { Course } from "@/types/course";

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const CourseCard = (props: Course) => {
  return (
    <article className={"flex flex-col gap-2 p-4 bg-white/10 rounded-3xl"}>
      <h2 className={"text-2xl font-bold"}>{props.title}</h2>
      <h3 className={"text-lg font-medium opacity-80"}>
        De {formatTime(props.start)} à {formatTime(props.end)}
      </h3>
      <p className={"whitespace-pre-line font-medium"}>{props.description}</p>
    </article>
  );
};

export default CourseCard;
