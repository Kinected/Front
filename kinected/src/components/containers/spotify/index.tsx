import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Spotify from "@/../public/Spotify.svg";

type Props = {
    onClick?: () => void;
    spotify_access_token: string;
};

type Song = {
    artist: string;
    track: string;
    cover: string;
};

export default function SpotifyPlayer(props: Props) {
    const [song, setSong] = useState<Song | null>(null);

    useEffect(() => {
        const fetchSong = async () => {
            const headers = {
                Authorization: `Bearer ${props.spotify_access_token}`,
            };

            fetch("https://api.spotify.com/v1/me/player/currently-playing", {
                headers,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.is_playing) {
                        const artist = data.item.artists[0].name;
                        const track = data.item.name;
                        const cover = data.item.album.images[0].url;

                        setSong({
                            artist,
                            track,
                            cover,
                        });
                    } else {
                        console.log("Aucune musique en cours de lecture");
                    }
                })
                .catch((error) => {
                    console.error(
                        "Erreur lors de l'obtention des données du lecteur :",
                        error
                    );
                });
        };

        fetchSong();
        const intervalId = setInterval(fetchSong, 1000);
        return () => clearInterval(intervalId);
    }, [props.spotify_access_token]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
            exit={{ opacity: 0 }}
            onClick={() => props.onClick && props.onClick()}
            className="w-48 aspect-square max-w-[25%] after:top-0 after:left-0 after:bg-white after:opacity-0 hover:after:opacity-80 after:rounded-2xl after:absolute after:w-full after:h-full relative aspect-square bg-white rounded-2xl flex flex-col p-2 gap-4 after:transition-all after:duration-500 transition-all duration-500 hover:scale-110 origin-bottom-left  "
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
                <Spotify className="w-20 aspect-square rounded-full" />
            </div>
            <div className="flex flex-col">
                <span className="text-md font-medium">{song?.track}</span>
                <span className="text-md text-gray-500 font-medium">
                    {song?.artist}
                </span>
            </div>
        </motion.div>
    );
}
