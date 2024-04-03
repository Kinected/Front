import { fetchUser } from "@/utils/get-user";
import { create } from "zustand";

type FaceStore = {
    userID: string | null;
    firstName: string;
    lastName: string;
    updateUser: (newUserID: string) => void;
};

export const useFaceStore = create<FaceStore>((set) => ({
    userID: null,
    firstName: "",
    lastName: "",
    updateUser: (newUserID: string) => {
        fetchUser(newUserID).then((data) => {
            console.log("data : ", data);
            set({
                userID: newUserID,
                firstName: data.firstname,
                lastName: data.lastname,
            });
        });
    },
}));
