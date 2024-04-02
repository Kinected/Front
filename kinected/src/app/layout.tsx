"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import React, { useEffect } from "react";

import SpotifyPlayer from "../components/containers/spotify";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/header";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import HomeButton from "@/components/home";
import MauriaWidget from "@/components/containers/mauria/widget";
import { useGesturesStore } from "@/stores/gestures.store";
import GestureHandler from "@/app/GestureHandler";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const path = usePathname();
  const queryClient = new QueryClient();

  const hand = useGesturesStore((state) => state.hand);
  const current_swipe = useGesturesStore((state) => state.current_swipe);

  const updateActionsOnSwipe = useGesturesStore(
    (state) => state.updateActionsOnSwipe,
  );

  useEffect(() => {
    updateActionsOnSwipe({
      "up-right": () => {
        console.log("swipe right");
        router.push("/spotify");
      },
    });
  }, []);

  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <body className={inter.className}>
          <GestureHandler>
            <div className="flex flex-col gap-8 p-4 w-full h-screen overflow-hidden">
              <Header hand={hand} />

              <div className="flex-1">{children}</div>

              {path === "/" && (
                <div className="flex justify-between items-end">
                  <AnimatePresence>
                    <SpotifyPlayer
                      isHover={current_swipe === "hover_up-right"}
                      onClick={() => router.push("/spotify")}
                    />
                  </AnimatePresence>
                  <AnimatePresence>
                    <MauriaWidget />
                  </AnimatePresence>
                </div>
              )}
              {path === "/spotify" && (
                <AnimatePresence>
                  <HomeButton />
                </AnimatePresence>
              )}
            </div>
          </GestureHandler>
        </body>
      </QueryClientProvider>
    </html>
  );
}