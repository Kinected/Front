"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import Button from "../components/button";
import clsx from "clsx";
import SpotifyPlayer from "../components/containers/spotify";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/header";
import { QueryClient, QueryClientProvider } from "react-query";
import HomeButton from "@/components/home";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const path = usePathname();
    const queryClient = new QueryClient();

    const token =
        "BQCBxh_0mnT8USh0Ey3LkK4YBj52vOFa6GbKgeYkFzbe6KNStu0_Kdfgy03fzKJ7fI1aI-3lNjIES_iWbpDRjIzFyenLFCmbtyIcoR3YSFCgrhhoToIZPVqBYItnnatOGFJswbHj6ETv9cm-qxX2Jy0-jIxZARCKCzLq5ejk2tk5nGVL";
    return (
        <html lang="en">
            <QueryClientProvider client={queryClient}>
                <body className={inter.className}>
                    <div className="flex flex-col gap-8 p-4 w-full h-screen overflow-hidden">
                        <Header />

                        <div className="flex-1">{children}</div>

                        {path === "/" && (
                            <div className="flex justify-between">
                                <AnimatePresence>
                                    <SpotifyPlayer
                                        onClick={() => router.push("/spotify")}
                                        spotify_access_token={token}
                                    />
                                </AnimatePresence>
                            </div>
                        )}
                        {path === "/spotify" && (
                            <AnimatePresence>
                                <HomeButton />
                            </AnimatePresence>
                        )}
                    </div>
                </body>
            </QueryClientProvider>
        </html>
    );
}
