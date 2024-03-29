"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CLIENT_ID = "e4073db5b2a64a4f9d807e9c6bb71c3b"; // Remplacez par votre client ID Spotify
const CLIENT_SECRET = "88204c90ac414b8da1408dd4eee69d1d";
const REDIRECT_URI = "http://localhost:3000"; // L'URL de redirection doit être la même que celle que vous avez configurée dans le tableau de bord de votre application Spotify
const SCOPES =
    "user-read-currently-playing user-modify-playback-state user-read-recently-played"; // Les scopes déterminent quelles actions votre application est autorisée à effectuer

const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
)}&scope=${encodeURIComponent(SCOPES)}`;

export default function Home() {
    const [token, setToken] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    useEffect(() => {
        if (!code || token) return;

        const authData = {
            grant_type: "authorization_code",
            code: code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        };

        fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(authData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.access_token) setToken(data.access_token);
            });
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <a href={authUrl}>Connect</a>

            <span>{token}</span>
            {token && <PlayerComponent code={token} />}
        </div>
    );
}

type Props = {
    code: string;
};

type Song = {
    artist: string;
    track: string;
};

const PlayerComponent = (props: Props) => {
    const [song, setSong] = useState<Song | null>(null);

    const playNextSong = () => {
        const headers = {
            Authorization: `Bearer ${props.code}`,
        };

        fetch("https://api.spotify.com/v1/me/player/next", {
            method: "POST",
            headers,
        })
            .then((response) => response.json()) // Ajoutez cette ligne pour obtenir le corps de la réponse
            .then((data) => {
                if (data.error) {
                    console.error(
                        "Erreur lors de la lecture de la chanson suivante :",
                        data.error
                    );
                } else {
                    console.log("Chanson suivante jouée avec succès");
                }
            })
            .catch((error) => {
                console.error(
                    "Erreur lors de la lecture de la chanson suivante :",
                    error
                );
            });
    };

    useEffect(() => {
        const headers = {
            Authorization: `Bearer ${props.code}`,
        };

        fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            headers,
        })
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((data) => {
                if (data.is_playing) {
                    const artist = data.item.artists[0].name;
                    const track = data.item.name;
                    setSong({ artist, track });
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
    }, [props.code]);

    return (
        <div className="flex gap-4">
            <button onClick={playNextSong}>Jouer la chanson suivante</button>
            {song
                ? `En cours de lecture : ${song.artist} - ${song.track}`
                : "Obtention des données du lecteur..."}
        </div>
    );
};
