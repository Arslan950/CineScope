import axios from "axios";
import { useAuthStore } from "../store/AuthStore.js";

const Backend_url = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
    baseURL: Backend_url,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; 

            try {
                await axios.post(`${Backend_url}/auth/refresh-accessToken`, {}, {
                    withCredentials: true
                });

                return api(originalRequest);

            } catch (refreshError) {
                useAuthStore.getState().forceLogout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;