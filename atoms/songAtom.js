import { atom } from "recoil";

export const currentTranckIdState = atom({
    key:"currectTrackIdState",
    default: null,
});

export const isPlayingState = atom({
    key:"isPlayingState",
    default: false,
});