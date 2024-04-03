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
          props.isHover && "w-20 -translate-y-1",
          "transition-all duration-500",
        )}
      />
      <span className="relative font-medium text-white text-lg">Accueil</span>
    </motion.div>
  );
}