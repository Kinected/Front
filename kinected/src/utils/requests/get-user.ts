export const fetchUser = async (id: string) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/user/?userID=${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
};
