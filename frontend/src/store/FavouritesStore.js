import { create } from 'zustand';
import { persist } from "zustand/middleware";
import api from "../lib/axiosInstance.js";
import debounce from "lodash.debounce";
import { toast } from 'react-toastify';

const syncWithBackend = debounce(async (list) => {
  try {
    await api.put("/favourites/sync", {
      "favouritesChanges": list
    });

    localStorage.removeItem('favourites_sync_pending');

  } catch (error) {
    if (error.response) {
      const backendMessage = error.response?.data?.message || "Something went wrong";
      toast.error(backendMessage)
    } else if (error.request) {
      const networkMsg = "Network error. Please check your connection.";
      toast.error(networkMsg);
    } else {
      const unexpectedMsg = "An unexpected error occurred.";
      toast.error(unexpectedMsg);
    }
  }
}, 3000);

export const useFavouritesStore = create(
  persist((set, get) => ({
    favouritesList: [],
    shareUrl : "",

    hydrateFavouritesList: async () => {
      const hasPendingSync = localStorage.getItem('favourites_sync_pending');

      if (hasPendingSync === 'true') {
        const localData = get().favouritesList;
        try {
          await api.put("/favourites/sync", { "favouritesChanges": localData });
          localStorage.removeItem('favourites_sync_pending');
        } catch (error) {
          if (error.response) {
            const backendMessage = error.response?.data?.message || "Something went wrong";
            toast.error(backendMessage)
          } else if (error.request) {
            const networkMsg = "Network error. Please check your connection.";
            toast.error(networkMsg);
          } else {
            const unexpectedMsg = "An unexpected error occurred.";
            toast.error(unexpectedMsg);
          }
          return ;
        }
      }

      try {
        const response = await api.get("/favourites/get-list");
        const backendList = response?.data?.data?.favourites || [];
        const sharedUrl = response.data?.data?.sharedUrl  || "" ;
        set({ favouritesList: backendList , shareUrl : sharedUrl});
      } catch (error) {
        if (error.response) {
          const backendMessage = error.response?.data?.message || "Something went wrong";
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

    addFavourites: (fav) => {
      set((state) => {
        const newList = [{ ...fav }, ...state.favouritesList];
        localStorage.setItem('favourites_sync_pending', 'true');
        syncWithBackend(newList);
        return { favouritesList: newList };
      });
    },

    removeFavourites: (id, type) => {
      set((state) => {
        const newList = state.favouritesList.filter((fav) => !(String(fav.id) === String(id) && fav.type === type));
        localStorage.setItem('favourites_sync_pending', 'true');
        syncWithBackend(newList);
        return { favouritesList: newList };
      });
    },

    addUrl : (url) => {
      set({shareUrl : url});
    },

    removeUrl : () => {
      set({shareUrl : ""})
    }
  }),
    {
      name: "favourites"
    }
  )
);