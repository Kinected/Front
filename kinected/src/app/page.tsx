"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
    return (
        <AnimatePresence>
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full w-full justify-center items-center"
            >
                <div className="flex flex-col">
                    <span className="text-white text-8xl text-start ">
                        Bonjour,
                    </span>
                    <span className="text-white text-8xl text-start font-extrabold">
                        Antoine
                    </span>
                </div>
            </motion.main>
        </AnimatePresence>
    );
}