import React from "react";
import { motion } from "framer-motion";

type Props = {
    onClick?: () => void;
};
export default function SpotifyPlayer(props: Props) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => props.onClick && props.onClick()}
            className="w-48 aspect-square max-w-[25%] after:top-0 after:left-0 after:bg-white after:opacity-0 hover:after:opacity-80 after:rounded-2xl after:absolute after:w-full after:h-full relative aspect-square bg-white rounded-2xl flex flex-col p-4 gap-4 after:transition-all after:duration-500 transition-all duration-500 hover:scale-110 origin-bottom-left  "
        >
            <div className="flex justify-between items-start gap-4">
                <div className="w-full aspect-square bg-gray-300 rounded-2xl" />
                <div className="w-20 aspect-square bg-gray-300 rounded-full" />
            </div>
            <div className="flex flex-col">
                <span className="text-md font-medium">The Lights</span>
                <span className="text-md text-gray-500 font-medium">
                    Joey Bada$$
                </span>
            </div>
        </motion.div>
    );
}
