export async function fetchMauriaPlanning() {
    const response = await fetch("http://localhost:8000/api/mauria?userID=1");

    return await response.json();
}
