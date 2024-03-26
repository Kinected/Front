"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
    return (
        <AnimatePresence>
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3 } }}
                exit={{ opacity: 0 }}
                className="flex h-full w-full justify-center items-center"
            >
                <span className="text-white text-8xl text-center font-bold text-center">
                    Ceci est spotify
                </span>
            </motion.main>
        </AnimatePresence>
    );
}
