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
      const newList = [{...fav }, ...state.favouritesList];
      saveFavourites(newList); 
      return { favouritesList: newList };
    });
  },

  removeFavourites: (id,type) => {
    set((state) => {
      const newList = state.favouritesList.filter((fav) => !(String(fav.id) === String(id) && fav.type === type));
      saveFavourites(newList);
      return { favouritesList: newList };
    });
  },
}));