"use client";

import "./globals.css";
import React, { useEffect } from "react";
import { Outfit } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "react-query";

import { useUserActionsStore } from "@/stores/gestures.store";

import Header from "@/components/header";
import HomeButton from "@/components/home";
import Provider from "@/components/provider";
import Head from "next/head";
import { useFaceStore } from "@/stores/faces.store";

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  const queryClient = new QueryClient();
  const router = useRouter();

  const current_swipe = useUserActionsStore((state) => state.current_action);

  const id = useFaceStore((state) => state.userID);

  // useEffect(() => {
  //   console.log("id", id);
  //   if (id == null) router.push("/camera");
  //   else router.push("/");
  // }, [id]);

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
        <body className={outfit.className}>
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
