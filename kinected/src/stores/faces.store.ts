import { fetchUser } from "@/utils/requests/get-user";
import { use } from "react";
import { create } from "zustand";

type FaceStore = {
    userID: string | null;
    firstName: string;
    lastName: string;
    isNewUser: boolean | null;
    gotMauria: boolean | null;
    gotSpotify: boolean | null;
    refreshUser: () => void;
    updateUser: (newUserID: string) => void;
};

export const useFaceStore = create<FaceStore>((set) => ({
    userID: "1",
    firstName: "Antoine",
    lastName: "Maes",
    isNewUser: null,
    gotMauria: true,
    gotSpotify: true,
    refreshUser: () => {
        const id = useFaceStore.getState().userID;
        if (!id) return;
        fetchUser(id).then((data) => {
            set({
                userID: useFaceStore.getState().userID,
                firstName: data.firstname,
                lastName: data.lastname,
                isNewUser: false,
                gotMauria: data.gotMauria,
                gotSpotify: data.gotSpotify,
            });
        });
    },
    updateUser: (newUserID: string) => {
        // if (newUserID == useFaceStore.getState().userID) return;
        if (newUserID == "Unknown") {
            console.log("Unknown user");
            set({
                userID: null,
                firstName: "",
                lastName: "",
                isNewUser: true,
                gotMauria: false,
                gotSpotify: false,
            });
            return;
        } else {
            fetchUser(newUserID).then((data) => {
                console.log(newUserID, data.firstname);
                console.log(data);
                set({
                    userID: newUserID,
                    firstName: data.firstname,
                    lastName: data.lastname,
                    isNewUser: false,
                    gotMauria: data.gotMauria,
                    gotSpotify: data.gotSpotify,
                });
            });
        }
    },
}));
