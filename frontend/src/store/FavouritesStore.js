import { create } from 'zustand';

const getInitialFavourites = () => {
  const savedFavourites = localStorage.getItem('favourites');
  return savedFavourites ? JSON.parse(savedFavourites) : []; 
};


const saveFavourites = (favouritesList) => {
  localStorage.setItem('favourites', JSON.stringify(favouritesList));
};

export const useFavouritesStore = create((set) => ({
  favouritesList: getInitialFavourites(),

  addFavourites: (fav) => {
    set((state) => {
      const newList = [{ id: Date.now(), ...fav }, ...state.favouritesList];
      saveFavourites(newList); 
      return { favouritesList: newList };
    });
  },

  removeFavourites: (id) => {
    set((state) => {
      const newList = state.favouritesList.filter((fav) => fav.id !== id);
      saveFavourites(newList);
      return { favouritesList: newList };
    });
  },
}));