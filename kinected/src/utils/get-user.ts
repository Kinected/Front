export const fetchUser = async (id: string) => {
    const response = await fetch(`http://localhost:8000/api/user?userID=${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
};
