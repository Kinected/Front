export async function fetchMauriaPlanning(userID: string) {
    const response = await fetch(
        `http://localhost:8000/api/mauria?userID=${userID}`
    );

    return await response.json();
}

export async function fetchUpdatedMauriaPlanning(userID: string) {
    const response = await fetch(
        `http://localhost:8000/api/mauria/update?userID=${userID}`
    );

    return await response.json();
}
