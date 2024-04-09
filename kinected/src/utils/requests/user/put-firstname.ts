import { useFaceStore } from "@/stores/faces.store";

type func = {
    success: boolean;
};

export async function putFirstname(
    firstname: string,
    userID: string
): Promise<func> {
    const response = await fetch(`http://localhost:8000/api/user/firstname`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            firstname,
            userID,
        }),
    });
    if (response.status !== 200) {
        throw new Error("Failed to update firstname");
    }

    useFaceStore.getState().refreshUser();
    return await response.json();
}
