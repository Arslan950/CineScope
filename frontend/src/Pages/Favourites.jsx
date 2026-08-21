import { useState, useMemo } from 'react';
import { useFavouritesStore } from '../store/FavouritesStore';
import Card from '../components/Cards/Card';
import { HeartIcon } from 'lucide-react';

const Favourites = () => {
  const favouritesList = useFavouritesStore((state) => state.favouritesList);

  const [filter, setFilter] = useState('All');

  const filteredList = useMemo(() => {
    return favouritesList.filter((media) => {
      if (filter === 'Movies') return media.type === 'movie';
      if (filter === 'Tv show') return media.type === 'tv';
      return true;
    });
  }, [favouritesList, filter]);

  if (favouritesList.length === 0) {
    return (
      <section className='min-h-[75vh] flex flex-col items-center justify-center px-4'>
        <div className='flex flex-col items-center gap-y-4 mb-12 text-center'>
          <h1 className='sm:text-4xl text-3xl font-bold text-slate-900 dark:text-white'>
            Your Favorite Movies
          </h1>
          <p className='text-slate-600 dark:text-white/75'>
            All your saved favorite movies in one place.
          </p>
        </div>

        <div className='flex flex-col items-center gap-y-6 max-w-md text-center'>
          <HeartIcon size={64} className="text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
          <p className='text-lg text-slate-600 dark:text-white/75'>
            You haven't added any favorites yet. Start exploring movies!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className='mt-20 w-full px-4 sm:px-8 lg:px-12 mb-10'>
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div className='border-b border-slate-200 dark:border-slate-800 pb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white'>
              Your Favorites
            </h1>
            <p className='text-slate-600 dark:text-white/75 mt-2 font-medium'>
              {favouritesList.length} {favouritesList.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white sm:px-4 sm:py-2.5 p-2 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer font-medium"
            >
              <option value="All">All</option>
              <option value="Movies">Movies</option>
              <option value="Tv show">TV Shows</option>
            </select>
          </div>
        </div>

        {filteredList.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 sm:gap-x-6 md:gap-x-8 lg:gap-x-10 xl:gap-x-12 gap-y-10 justify-items-center'>
            {filteredList.map((media) => (
              <Card
                key={media.id}
                id={media.id}
                title={media.title}
                poster={media.poster}
                rating={media.rating}
                type={media.type}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400">
            No {filter.toLowerCase()} found in your favorites.
          </div>
        )}

      </div>
    </section>
  );
}

export default Favourites;