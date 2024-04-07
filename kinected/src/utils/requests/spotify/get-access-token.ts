export const fetchSpotifyAccessToken = async (userID: string) => {
    const response = await fetch(
        `http://localhost:8000/api/spotify?userID=${userID}`
    );

    return await response.json();
};
