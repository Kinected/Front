import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export const Page = (props: Props) => {
  return (
    <AnimatePresence>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.3 } }}
        exit={{ opacity: 0 }}
        className={twMerge(
          "flex h-full flex-col justify-center gap-8 text-white px-6",
          props.className,
        )}
      >
        {props.children}
      </motion.main>
    </AnimatePresence>
  );
};

export default Page;
