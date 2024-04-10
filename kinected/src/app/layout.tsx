"use client";

import "./globals.css";
import React from "react";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "react-query";

import { useUserActionsStore } from "@/stores/gestures.store";

import Header from "@/components/header";
import HomeButton from "@/components/home";
import Provider from "@/components/provider";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  const queryClient = new QueryClient();

  const current_swipe = useUserActionsStore((state) => state.current_action);

  // Default values shown
  return (
    <html lang="fr">
      <Head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/ring.js"
        />
      </Head>

      <QueryClientProvider client={queryClient}>
        <body className={inter.className}>
          <Provider>
            <div className="flex flex-col gap-8 p-4 w-full h-screen overflow-hidden">
              <Header />

              {children}

              {path !== "/" && (
                <AnimatePresence>
                  <HomeButton isHover={current_swipe === "hover_up"} />
                </AnimatePresence>
              )}
            </div>
          </Provider>
        </body>
      </QueryClientProvider>
    </html>
  );
}
