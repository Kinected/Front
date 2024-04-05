import exp from "constants";
import { formatDuration } from "./format-duration";
import { Song } from "@/types/song";

export const tooglePlayerState = async (token: string, isPlay: boolean) => {
    const response = await fetch(
        `https://api.spotify.com/v1/me/player/${isPlay ? "play" : "pause"}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    console.log(response);
};

export async function playNextSong(token: string) {
    const response = await fetch("https://api.spotify.com/v1/me/player/next", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la lecture de la chanson suivante");
    }
}

export async function playPreviousSong(token: string) {
    const response = await fetch(
        "https://api.spotify.com/v1/me/player/previous",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Erreur lors de la lecture de la chanson précédente");
    }
}

export async function fetchNextSong(token: string) {
    const response = await fetch("https://api.spotify.com/v1/me/player/queue", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    try {
        const data = await response.json();

        const artist = data.queue[0].artists[0].name;
        const track = data.queue[0].name;
        const cover = data.queue[0].album.images[0].url;
        const duration = formatDuration(Number(data.queue[0].duration_ms));

        return {
            artist,
            track,
            cover,
            duration,
        } as Song;
    } catch (e) {
        return null;
    }
}
