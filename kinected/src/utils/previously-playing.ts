import { Song } from "@/types/song";
import { formatDuration } from "./format-duration";

export const fetchPreviousSong = async (token: string) => {
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const response = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played?limit=2",
        {
            headers,
        }
    );

    const data = await response.json();

    const prevSong = data.items[1].track;
    return {
        artist: prevSong.artists[0].name,
        track: prevSong.name,
        cover: prevSong.album.images[0].url,
        duration: formatDuration(prevSong.duration_ms),
    } as Song;
};
