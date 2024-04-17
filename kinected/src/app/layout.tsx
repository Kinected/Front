"use client";

import "./globals.css";
import React from "react";
import { Outfit } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "react-query";

import { useUserActionsStore } from "@/stores/gestures.store";

import Header from "@/components/header";
import Provider from "@/components/provider";
import ListeningContainer from "@/components/Layout/ListeningContainer";
import SwipeButton from "@/components/Layout/Buttons/SwipeButton";
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
  return (
    <html lang="fr">
      <QueryClientProvider client={queryClient}>
        <body className={outfit.className}>
          <Provider>
            <ListeningContainer>
              <div className="flex flex-col items-center gap-8 p-4 w-full h-full overflow-hidden">
                <Header />
                {children}
                {path !== "/" && (
                  <SwipeButton
                    position={"up"}
                    onClick={() => router.push("/")}
                    isHover={current_swipe === "hover_up"}
                  >
                    Accueil
                  </SwipeButton>
                )}
              </div>
            </ListeningContainer>
          </Provider>
        </body>
      </QueryClientProvider>
    </html>
  );
}
