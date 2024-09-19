import { RootState } from "@/src/store";

export const appUserSelector = (state: RootState) => state.rootReducer.appUser;