import {create} from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
    user : null ,
    isLoggedIn : false ,
    isLoading : true ,
    
    checkAuth : async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/userInfo`,{
                withCredentials : true
            });
            set({user : response.data.data , isLoggedIn : true , isLoading : false})
        } catch (error) {
            set({user : null , isLoggedIn : false , isLoading : false})
        }
    },

    setLoggedIn : (user) => {
        set({user, isLoggedIn : true , isLoading : false})
    },

    loggedOut : async () => {
        try{
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`,{},{
                withCredentials : true 
            })
        }finally{
        set({user : null , isLoggedIn : false })
        }
    }
}));