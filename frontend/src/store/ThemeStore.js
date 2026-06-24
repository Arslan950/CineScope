import { create } from "zustand";


const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : "dark" 
}

export const useThemeStore = create((set) => ({
    theme : getInitialTheme(),

    darkTheme : () => {
        localStorage.setItem('theme','dark');
        set({theme : "dark"})
    },

    lightTheme : () => {
        localStorage.setItem('theme','light');
        set({theme : "light"});
    },
}))