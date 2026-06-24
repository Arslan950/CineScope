import { useFavouritesStore } from '../store/FavouritesStore';
import Card from '../components/Cards/Card'
import { HeartIcon } from 'lucide-react'
const Favourites = () => {
  const { favouritesList } = useFavouritesStore();

  if (favouritesList.length === 0) {
    return (
      <div className='max-w-6xl flex flex-col items-center m-6 gap-y-20 mt-13'>
        <div className='flex flex-col items-center gap-y-5'>
          <h1 className='sm:text-4xl text-2xl font-semibold text-slate-900 dark:text-white'>Your Favorite Movies</h1>

          <p className='text-slate-600 dark:text-white/75 whitespace-nowrap'>All your saved favorite movies in one place.</p>
        </div>
        <div className='flex flex-col items-center m-6 gap-y-6'>
          <HeartIcon size={50} opacity={0.6} />
          <p className='text-slate-600 dark:text-white/75 text-center'>You haven't added any favorites yet. Start exploring movies!</p>
        </div>
      </div>
    )
  }

  return (
<div className='flex w-full flex-col items-center bg-greeen-500 p-2 sm:p-6 md:p-8'>
    <section className='grid sm:w-full sm:max-w-8xl grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 sm:pl-16 max-[373px]:grid-cols-1'>
        {favouritesList.map((movie) => (
            <Card
                visiblity={1}
                key={movie.id}
                id={movie.id}
                title={movie.title}
                poster={movie.poster}
                rating={movie.ratings}
            />
        ))}
    </section>
</div>
  )
}

export default Favourites