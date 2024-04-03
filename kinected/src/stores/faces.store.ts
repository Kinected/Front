import { fetchUser } from "@/utils/get-user";
import { create } from "zustand";

type FaceStore = {
    userID: string | null;
    firstName: string;
    lastName: string;
    isNewUser: boolean;
    updateUser: (newUserID: string) => void;
};

export const useFaceStore = create<FaceStore>((set) => ({
    userID: null,
    firstName: "",
    lastName: "",
    isNewUser: false,
    updateUser: (newUserID: string) => {
        if (newUserID == "Unknown") {
            console.log("Unknown user");
            set({
                userID: null,
                firstName: "",
                lastName: "",
                isNewUser: true,
            });
            return;
        } else {
            fetchUser(newUserID).then((data) => {
                console.log(newUserID);
                console.log(data.firstname);
                set({
                    userID: newUserID,
                    firstName: data.firstname,
                    lastName: data.lastname,
                    isNewUser: false,
                });
            });
        }
    },
}));
