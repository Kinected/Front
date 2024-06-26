import React from "react";
import { Song } from "@/types/song";
import { useQuery } from "react-query";
import { fetchCurrentlyPlaying } from "@/utils/requests/spotify/currently-playing";
import { fetchPreviousSong } from "@/utils/requests/spotify/previously-playing";
import {
  fetchNextSong,
  playNextSong,
  playPreviousSong,
} from "@/utils/requests/spotify/pause";
import CarouselItem from "./item";
import { Actions } from "@/stores/gestures.store";

type Props = {
  token: string;
  currentSwipe: Actions | null;
  previous: Song | null;
  setPreviousSong: (song: Song) => void;
  current: Song | null;
  setCurrentSong: (song: Song) => void;
};

export default function SpotifyCarousel(props: Props) {
  const { data: song } = useQuery<Song | null>({
    queryKey: ["song", "current"],
    queryFn: async () => {
      const newSong = await fetchCurrentlyPlaying(props.token);
      if (!newSong) return null;
      if (props.current?.track !== newSong.track) {
        if (props.current) props.setPreviousSong(props.current);
        props.setCurrentSong(newSong);
      }
      return newSong;
    },
    refetchInterval: 1000,
  });

  useQuery<Song | null>({
    queryKey: ["song", "previous"],
    queryFn: async () => {
      const data = await fetchPreviousSong(props.token);
      props.setPreviousSong(data);
      return data;
    },
  });

  const { data: next } = useQuery<Song | null>({
    queryKey: ["song", "next"],
    queryFn: async () => {
      return fetchNextSong(props.token);
    },
    refetchInterval: 1000,
  });

  if (!props.previous || !props.current || !next) {
    if (props.current) {
      return (
        <div className="relative flex items-center justify-center">
          <CarouselItem position="center" cover={props.current.cover} />
        </div>
      );
    }
    return (
      <span className={"text-white text-center text-4xl w-2/3 mx-auto"}>
        Aucune musique n&apos;est jouée pour le moment
      </span>
    );
  }
  return (
    <div className="relative grid grid-cols-6 gap-24 items-center justify-center">
      <CarouselItem
        position="left"
        isHover={props.currentSwipe === "hover_right"}
        cover={props.previous.cover}
        onClick={() => playPreviousSong(props.token)}
      />
      <CarouselItem position="center" cover={props.current.cover} />
      <CarouselItem
        position="right"
        isHover={props.currentSwipe === "hover_left"}
        cover={next.cover}
        onClick={() => playNextSong(props.token)}
      />
    </div>
  );
}
