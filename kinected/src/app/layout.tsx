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

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  const queryClient = new QueryClient();

  const current_swipe = useUserActionsStore((state) => state.current_action);

  return (
    <html lang="en">
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
