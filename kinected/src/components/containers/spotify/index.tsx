import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Spotify from "@/../public/Spotify.svg";
import { useQuery } from "react-query";
import { fetchSpotifyAccessToken } from "@/utils/get-access-token";
import { fetchCurrentlyPlaying } from "@/utils/currently-playing";
import { twMerge } from "tailwind-merge";

type Props = {
  onClick?: () => void;
  isHover?: boolean;
};

type Song = {
  artist: string;
  track: string;
  cover: string;
};

export default function SpotifyPlayer(props: Props) {
  const { data: token } = useQuery<string>({
    queryKey: ["spotify", "token"],
    queryFn: async () => {
      return await fetchSpotifyAccessToken("1");
    },
  });

  const {
    data: song,
    isLoading,
    isError,
    error,
  } = useQuery<Song | null>({
    queryKey: ["song", "current"],
    queryFn: async () => {
      return await fetchCurrentlyPlaying(token as string);
    },
    enabled: !!token,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.3 } }}
      exit={{ opacity: 0 }}
      onClick={() => props.onClick && props.onClick()}
      className={twMerge(
        "size-48 max-w-[25%]",
        "after:absolute after:top-0 after:left-0 after:-z-10",
        "after:bg-white after:rounded-2xl",
        "after:w-full after:h-full",
        "after:transition-all after:duration-500",
        props.isHover &&
          "scale-110 after:opacity-40 after:scale-110 after:rounded-3xl",
        "relative bg-white rounded-2xl flex flex-col p-2 gap-4 transition-all duration-500 origin-bottom-left",
      )}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="relative w-full aspect-square bg-gray-300 rounded-2xl">
          {song && (
            <Image
              alt="cover current song"
              src={song.cover}
              fill
              className="rounded-2xl fit-cover"
            />
          )}
        </div>
        <Spotify className="min-w-12 w-12" />
      </div>
      <div className="flex flex-col">
        <span className="text-md font-medium">{song?.track}</span>
        <span className="text-md text-gray-500 font-medium">
          {song?.artist}
        </span>
        {song == null && (
          <span className="text-sm font-medium">
            Aucune musique n&apos;est jouée pour le moment
          </span>
        )}
      </div>
    </motion.div>
  );
}