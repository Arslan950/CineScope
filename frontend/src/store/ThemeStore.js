import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
    persist(
        (set) => ({
            theme: "dark",
            darkTheme: () => set({ theme: "dark" }),
            lightTheme: () => set({ theme: "light" }),
        }),
        {
            name: "theme",
        }
    )
);