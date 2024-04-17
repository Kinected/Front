import { fetchUser } from "@/utils/requests/get-user";
import { create } from "zustand";

type FaceStore = {
  userID: string | null;
  firstName: string;
  lastName: string;
  isNewUser: boolean | null;
  gotMauria: boolean | null;
  gotSpotify: boolean | null;
  gotIleviaBus: boolean | null;
  gotIleviaVlille: boolean | null;
  refreshUser: () => void;
  updateUser: (newUserID: string) => void;
};

export const useFaceStore = create<FaceStore>((set) => ({
  userID: null,
  firstName: "",
  lastName: "",
  isNewUser: null,
  gotMauria: false,
  gotSpotify: false,
  gotIleviaBus: false,
  gotIleviaVlille: false,
  refreshUser: () => {
    const id = useFaceStore.getState().userID;
    if (!id) return;

    fetchUser(id).then((data) => {
      set({
        userID: data.id,
        firstName: data.firstname,
        lastName: data.lastname,
        isNewUser: false,
        gotMauria: data.gotMauria,
        gotSpotify: data.gotSpotify,
        gotIleviaBus: data.gotIleviaBus,
        gotIleviaVlille: data.gotIleviaVlille,
      });
    });
  },
  updateUser: (newUserID: string) => {
    // if (newUserID == useFaceStore.getState().userID) return;

    if (newUserID == "Unknown") {
      set({
        userID: null,
        firstName: "",
        lastName: "",
        isNewUser: true,
        gotMauria: false,
        gotSpotify: false,
        gotIleviaBus: false,
        gotIleviaVlille: false,
      });
      return;
    }

    fetchUser(newUserID).then((data) => {
      set({
        userID: data.id,
        firstName: data.firstname,
        lastName: data.lastname,
        isNewUser: false,
        gotMauria: data.gotMauria,
        gotSpotify: data.gotSpotify,
        gotIleviaBus: data.gotIleviaBus,
        gotIleviaVlille: data.gotIleviaVlille,
      });
    });
  },
}));
