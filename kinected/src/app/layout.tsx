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

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const path = usePathname();

    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="flex flex-col gap-8 p-8 w-full h-screen">
                    <Header />

                    <div className="flex-1">{children}</div>

                    <div className="flex justify-between">
                        <AnimatePresence>
                            {path === "/" && (
                                <SpotifyPlayer
                                    onClick={() => router.push("/spotify")}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </body>
        </html>
    );
}
