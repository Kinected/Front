import { Song } from "@/types/song";
import { formatDuration } from "./format-duration";

export const fetchCurrentlyPlaying = async (token: string) => {
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const response = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
            headers,
        }
    );
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    try {
        const data = await response.json();
        const artist = data.item.artists[0].name;
        const track = data.item.name;
        const cover = data.item.album.images[0].url;
        const progress =
            Number(data.progress_ms) / Number(data.item.duration_ms);
        const isplaying = data.is_playing;

        const duration = formatDuration(Number(data.item.duration_ms));
        const time = formatDuration(Number(data.progress_ms));

        return {
            artist,
            track,
            cover,
            time,
            duration,
            progress,
            isplaying,
        } as Song;
    } catch (error) {
        return null;
    }
};
