import {create} from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const Backend_url = import.meta.env.VITE_BACKEND_URL ;

export const useAuthStore = create((set) => ({
    user : null ,
    isLoggedIn : false ,
    isLoading : true ,
    
    checkAuth : async () => {
        try {
            const response = await axios.get(`${Backend_url}/auth/userInfo`,{
                withCredentials : true
            });
            set({user : response.data.data , isLoggedIn : true , isLoading : false})
        } catch (error) {
            set({user : null , isLoggedIn : false , isLoading : false})
        }
    },

    login : async (email,password) => {
        try {
            const response = await axios.post(`${Backend_url}/auth/login`,{
                "email" : email,
                "password" : password
            },{
                withCredentials : true ,
            });

            const userData = response?.data?.data ;
            set({user : userData , isLoggedIn : true , isLoading : false})
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
    
    loggedOut : async () => {
        try{
            await axios.post(`${Backend_url}/auth/logout`,{},{
                withCredentials : true 
            })
        }finally{
        set({user : null , isLoggedIn : false })
        }
    }
}));