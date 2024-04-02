"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import React, { useEffect } from "react";

import SpotifyPlayer from "../components/containers/spotify";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/header";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { useGesturesStore } from "@/stores/gestures.store";
import GestureHandler from "@/app/GestureHandler";
import ListeningFeedback from "@/components/Feedbacks/ListeningFeedback";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const path = usePathname();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  const swipe = useGesturesStore((state) => state.current_swipe);
  const hand = useGesturesStore((state) => state.hand);
  const setActionsOnSwipe = useGesturesStore(
    (state) => state.updateActionsOnSwipe,
  );

  useEffect(() => {
    setActionsOnSwipe({
      "up-right": () => {
        router.push("/spotify");
      },
    });
  }, []);

  const token =
    "BQCBxh_0mnT8USh0Ey3LkK4YBj52vOFa6GbKgeYkFzbe6KNStu0_Kdfgy03fzKJ7fI1aI-3lNjIES_iWbpDRjIzFyenLFCmbtyIcoR3YSFCgrhhoToIZPVqBYItnnatOGFJswbHj6ETv9cm-qxX2Jy0-jIxZARCKCzLq5ejk2tk5nGVL";
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <body className={inter.className}>
          <GestureHandler>
            <div className="flex flex-col gap-8 p-8 w-full h-screen">
              <Header />
              <ListeningFeedback hand={hand} />

              <div className="flex-1">{children}</div>

              <div className="flex justify-between">
                <AnimatePresence>
                  {path === "/" && (
                    <SpotifyPlayer
                      isHover={swipe === "hover_up-right"}
                      onClick={() => router.push("/spotify")}
                      spotify_access_token={token}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </GestureHandler>
        </body>
      </QueryClientProvider>
    </html>
  );
}