import { create } from 'zustand';
import api from "../lib/axiosInstance.js";
import debounce from "lodash.debounce";
import { toast } from 'react-toastify';

const getInitialFavourites = () => {
  const savedFavourites = localStorage.getItem('favourites');
  return savedFavourites ? JSON.parse(savedFavourites) : [];
};

const saveFavouritesLocally = (favouritesList) => {
  localStorage.setItem('favourites', JSON.stringify(favouritesList));
  localStorage.setItem('favourites_sync_pending', 'true');
};

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

export const useFavouritesStore = create((set,get) => ({
  favouritesList: getInitialFavourites(),

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
      }
      return;
    }

    try {
      const response = await api.get("/favourites/get-list");
      const backendList = response?.data?.data?.favourites || [];
      localStorage.setItem('favourites', JSON.stringify(backendList));
      set({ favouritesList : backendList });
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
      saveFavouritesLocally(newList);
      syncWithBackend(newList);
      return { favouritesList: newList };
    });
  },

  removeFavourites: (id, type) => {
    set((state) => {
      const newList = state.favouritesList.filter((fav) => !(String(fav.id) === String(id) && fav.type === type));
      saveFavouritesLocally(newList);
      syncWithBackend(newList);
      return { favouritesList: newList };
    });
  },
}));