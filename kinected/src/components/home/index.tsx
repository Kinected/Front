import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";

export default function HomeButton() {
    const router = useRouter();
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
            exit={{ opacity: 0 }}
            className="flex items-center flex-col"
            onClick={() => router.push("/")}
        >
            <div className="w-fit hover:scale-110 transition-all duration-500">
                <span className="relative font-medium text-white text-lg after:absolute after:w-full after:bg-white after:h-1 after:left-0 after:-top-2 after:rounded-2xl">
                    Accueil
                </span>
            </div>
        </motion.div>
    );
}
