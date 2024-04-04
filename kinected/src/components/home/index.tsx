import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";

type HomeButtonProps = {
  isHover?: boolean;
};

export default function HomeButton(props: HomeButtonProps) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.3 } }}
      exit={{ opacity: 0 }}
      className={twMerge(
        "flex flex-col items-center gap-1",
        props.isHover && "scale-110",
        "transition-all duration-500",
      )}
      onClick={() => router.push("/")}
    >
      <div
        className={twMerge(
          "h-1.5 w-16 bg-white rounded-full",
          props.isHover && "w-24 -translate-y-2",
          "transition-all duration-500",
        )}
      />
      <div className={"relative py-2 px-4 "}>
        <div className={twMerge("absolute -z-10 inset-0 rounded-xl bg-white scale-50 opacity-0", props.isHover && "scale-100 opacity-100", "transition duration-300")}/>
        <span className={twMerge("font-medium text-white text-lg", props.isHover && "text-black", "transition duration-300")}>
          Accueil
        </span>
      </div>
    </motion.div>
  );
}