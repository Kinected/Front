"use client";
import React, { useEffect, useLayoutEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import { User } from "@/types/user";
import { fetchUser } from "@/utils/get-user";
import { useGesturesStore } from "@/stores/gestures.store";
import { useRouter } from "next/navigation";

export default function Home() {
  const id = "1";

  const router = useRouter();
  const { data: user } = useQuery<User>({
    queryKey: ["user", id],
    queryFn: async () => {
      return await fetchUser(id);
    },
  });

  if (!user) return null;



  return (
    <AnimatePresence>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex h-full w-full justify-center items-center"
      >
        <div className="flex flex-col">
          <span className="text-white text-8xl text-start ">Bonjour,</span>
          <span className="text-white text-8xl text-start font-bold">
            {user?.firstname}
          </span>
        </div>
      </motion.main>
    </AnimatePresence>
  );
}