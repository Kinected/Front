"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import { User } from "@/types/user";
import { fetchUser } from "@/utils/get-user";
import SpotifyPlayer from "@/components/containers/spotify";
import MauriaWidget from "@/components/containers/mauria/widget";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const id = "1";
    const { data: user } = useQuery<User>({
        queryKey: ["user", id],
        queryFn: async () => {
            return await fetchUser(id);
        },
    });

    if (!user) return null;

    return (
        <div className="flex flex-col flex-1">
            <div className="flex-1 flex items-center justify-center">
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
                            <span className="text-white text-8xl text-start font-bold">
                                {user?.firstname}
                            </span>
                        </div>
                    </motion.main>
                </AnimatePresence>
            </div>

            <div className="flex justify-between items-end">
                <AnimatePresence>
                    <SpotifyPlayer onClick={() => router.push("/spotify")} />
                </AnimatePresence>
                <AnimatePresence>
                    <MauriaWidget />
                </AnimatePresence>
            </div>
        </div>
    );
}
