import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const Backend_url = import.meta.env.VITE_BACKEND_URL;

export const useAuthStore = create((set) => ({
    user: null,
    isLoggedIn: false,
    isLoading: true,

    checkAuth: async () => {
        try {
            const response = await axios.get(`${Backend_url}/auth/userInfo`, {
                withCredentials: true
            });
            set({ user: response.data.data, isLoggedIn: true, isLoading: false })
        } catch (error) {
            set({ user: null, isLoggedIn: false, isLoading: false })
        }
    },

    login: async (email, password) => {
        try {
            const response = await axios.post(`${Backend_url}/auth/login`, {
                "email": email,
                "password": password
            }, {
                withCredentials: true,
            });

            const userData = response?.data?.data;
            set({ user: userData, isLoggedIn: true, isLoading: false })
            toast("Login succesfully");

        } catch (error) {
            if (error.response) {
                const backendMessage = error.response?.data?.message || "Invalid credentials. Please try again.";
                toast.error(backendMessage);
            } else if (error.request) {
                const networkMsg = "Network error. Please check your connection.";
                toast.error(networkMsg);
            } else {
                const unexpectedMsg = "An unexpected error occurred.";
                toast.error(unexpectedMsg);
            }
        }
    },

    loggedOut: async () => {
        try {
            await axios.post(`${Backend_url}/auth/logout`, {}, {
                withCredentials: true
            })
        } finally {
            set({ user: null, isLoggedIn: false })
        }
    },

    editUserInfo: async (preview, selectedGenres, fullName) => {
        const formData = {};
        if (preview) formData.avatar = preview;
        if (selectedGenres) formData.genres = selectedGenres;
        if (fullName) formData.fullName = fullName;

        try {
            const response = await axios.patch(`${Backend_url}/auth/editInfo`,
                formData,
                {
                    withCredentials: true
                });

            const userData = response?.data?.data;
            set({ user: userData })

        } catch (error) {
            if (error.response) {
                const backendMessage = error.response?.data?.message || "Somewith went wrong(2)"
                toast.error(backendMessage)
            } else if (error.request) {
                const networkMsg = "Network error. Please check your connection.";
                toast.error(networkMsg);
            } else {
                const unexpectedMsg = "An unexpected error occurred.";
                toast.error(unexpectedMsg);
            }
        }
    },

    googleAuth: async (code) => {
        try {
            const response = await axios.post(`${Backend_url}/auth/google`, {
                "code": code
            }, { withCredentials: true });

            const userData = response?.data?.data
            set({ user: userData, isLoggedIn: true, isLoading: false })
            toast("Google Auth successfull");

            return {
                isSuccess: true,
                googleAuthError: null
            };

        } catch (error) {
            console.error("Backend Error during Google Auth:", error);
            const backendMessage = error.response?.data?.message || "Google Authentication Failed";
            toast.error(backendMessage);

            return {
                isSuccess: false,
                googleAuthError: error
            };
        }
    }
}));