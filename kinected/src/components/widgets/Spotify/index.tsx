import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Spotify from "../../../icons/Spotify.svg";
import { useQuery } from "react-query";
import { fetchSpotifyAccessToken } from "@/utils/requests/spotify/get-access-token";
import { fetchCurrentlyPlaying } from "@/utils/requests/spotify/currently-playing";
import { fetchPreviousSong } from "@/utils/requests/spotify/previously-playing";
import { tv } from "tailwind-variants";

type Props = {
  onClick?: () => void;
  isHover?: boolean;
};

type Song = {
  artist: string;
  track: string;
  cover: string;
};

const container = tv({
  base: [
    "relative",
    "flex flex-col gap-2",
    "size-48",
    "bg-white rounded-3xl p-2",
    "origin-bottom-left transition-all duration-500",
    "after:absolute after:top-0 after:left-0 after:-z-10",
    "after:bg-white after:rounded-3xl",
    "after:w-full after:h-full",
    "after:transition-all after:duration-500",
  ],
  variants: {
    isHover: {
      true: ["scale-110 after:opacity-40 after:scale-110 after:rounded-3xl"],
    },
  },
});

export default function SpotifyWidget(props: Props) {
  const { data: token } = useQuery<string>({
    queryKey: ["spotify", "token"],
    queryFn: async () => {
      return await fetchSpotifyAccessToken("1");
    },
  });

  const { data: song } = useQuery<Song | null>({
    queryKey: ["song", "current"],
    queryFn: async () => {
      return await fetchCurrentlyPlaying(token as string);
    },
    refetchInterval: 1000,
    enabled: !!token,
  });

  const { data: previousSong } = useQuery<Song | null>({
    queryKey: ["song", "previous"],
    queryFn: async () => await fetchPreviousSong(token as string),
    enabled: !!token,
  });

  const displayedSong = song || previousSong;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.3 } }}
      exit={{ opacity: 0 }}
      onClick={() => props.onClick && props.onClick()}
      className={container({
        isHover: props.isHover,
      })}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="relative w-full aspect-square bg-gray-300 rounded-2xl">
          {displayedSong && (
            <Image
              alt="cover current song"
              src={displayedSong.cover}
              fill
              className="rounded-2xl fit-cover"
            />
          )}
        </div>
        <Spotify className="min-w-12 w-12" />
      </div>
      <div className="flex flex-col px-1 py-0.5">
        <span className="text-md font-medium truncate leading-tight">
          {displayedSong && displayedSong.track}
        </span>
        <span className="text-md text-gray-500 font-medium leading-tight">
          {displayedSong && displayedSong.artist}
        </span>
      </div>
    </motion.div>
  );
}
