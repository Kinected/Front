"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React, { useEffect, useRef, useState } from "react";
import Button from "../components/button";
import clsx from "clsx";
import SpotifyPlayer from "../components/containers/spotify";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/header";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import HomeButton from "@/components/home";
import MauriaWidget from "@/components/containers/mauria/widget";
import Video from "@/components/containers/video";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const path = usePathname();
    const queryClient = new QueryClient();

    return (
        <html lang="en">
            <QueryClientProvider client={queryClient}>
                <body className={inter.className}>
                    <div className="flex flex-col gap-8 p-4 w-full h-screen overflow-hidden">
                        <Header />

                        {children}

                        {path !== "/" && (
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
function useMediaQuery(arg0: string): [any] {
    throw new Error("Function not implemented.");
}
