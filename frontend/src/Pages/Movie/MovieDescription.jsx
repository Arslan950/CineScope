import React from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { AnimatedSubscribeButton } from '../../components/ui/AnimatedButton'
import MoviesDetailsSkeletons from '../../components/skeletons/MoviesDetailsSkeleton'
import ChevronRightIcon from '../../components/icons/ChevronRightIcon'
import CheckIcon from '../../components/icons/CheckIcon'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import HeartFavourites from '../../components/Cards/HeartFavourites'
import { useFavouritesStore } from '../../store/FavouritesStore'
import useFetchDetails from '../../hooks/useFetchDetails'

const MovieDescription = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [isFavourited, setIsFavourited] = useState(false);
  const { favouritesList } = useFavouritesStore();
  const scrollTargetRef = useRef(null);

  const { movieData, loading } = useFetchDetails(title);

  useEffect(() => {
    if (movieData && movieData.Title) {
      const isMovieInFavourites = favouritesList.some(
        (movie) => movie.title === movieData.Title
      );
      setIsFavourited(isMovieInFavourites);
    }
  }, [favouritesList, movieData]);

  useEffect(() => {
    if (scrollTargetRef.current) {
      scrollTargetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [movieData.Title]);

  if (loading) {
    return (
      <MoviesDetailsSkeletons />
    )
  }

  if (movieData?.Response === 'False') {
    return (
      <div className='flex flex-col items-center gap-y-8 mt-6'>
        <h1 className='sm:text-5xl text-3xl font-semibold'>No movie found 😕</h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/search')}
          className='bg-blue-500 text-white font-semibold sm:text-lg sm:p-2 p-1.5 rounded-xl hover:bg-white hover:text-blue-500 duration-300'
        >
          Go back to Search
        </motion.button>
      </div>
    )
  }

  return (
    <>
      <SearchBar className='sm:mt-8 mt-6 sm:mb-0 mb-3' classNameforIcon='sm:top-14 top-12' classNameforButton='sm:top-14 top-12' />
      <div className="text-slate-900 dark:text-white font-sans p-6 sm:p-8 lg:p-12 " >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12 " ref={scrollTargetRef}>

          <div className="flex-shrink-0 w-full md:w-1/3 ">
            <img
              src={(movieData?.Poster != "N/A") ? (movieData?.Poster) : `https://placehold.co/383x574/333333/FFF?text=${movieData.Title}`}
              alt='Poster not found'
              className="sm:w-full rounded-xl shadow-2xl mx-auto sm:aspect-[2/3] object-cover transition-transform duration-300 ease-in-out hover:scale-105 text-2xl bg-neutral-300 dark:bg-neutral-700 text-center text-black dark:text-white font-semibold"
            />
          </div>

          <div className="flex-1 flex flex-col ">
            <h1 className="text-4xl lg:text-5xl font-bold mb-3 sm:text-left text-center text-balance">{movieData?.Title}</h1>

            <div className="flex items-center divide-x divide-gray-300 dark:divide-gray-700 mb-6 sm:justify-start justify-center">
              <span className="flex items-center text-gray-700 dark:text-gray-300 text-sm pr-4 font-medium">
                ⭐ <span className="ml-1.5">{movieData?.Ratings?.[0]?.Value || `N/A`}</span>
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-sm pl-4">{movieData?.Runtime}</span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
              {movieData?.Plot || `Plot not available`}
            </p>

            <div className="space-y-3">
              <p><span className="font-semibold text-slate-900 dark:text-white">Country:</span><span className="text-gray-600 dark:text-gray-400 ml-2">{movieData?.Country || `Not available`}</span></p>
              <p><span className="font-semibold text-slate-900 dark:text-white">Genre:</span><span className="text-gray-600 dark:text-gray-400 ml-2">{movieData?.Genre || `Not available`}</span></p>
              <p><span className="font-semibold text-slate-900 dark:text-white">Released:</span><span className="text-gray-600 dark:text-gray-400 ml-2">{movieData?.Released || `Not available`}</span></p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">Casts:</span><span className="text-gray-600 dark:text-gray-400 ml-2">{movieData?.Actors || `Not available`}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">Director:</span><span className="text-gray-600 dark:text-gray-400 ml-2">{movieData.Director || `Not available`}</span>
              </p>
            </div>

            <div className="flex items-center gap-4 pt-8 sm:justify-start justify-center">
              <HeartFavourites
                SVGClassName='hidden'
                title={movieData?.Title}
                poster={(movieData?.Poster != "N/A") ? (movieData?.Poster) : `https://placehold.co/383x574/333333/FFF?text=${movieData.Title}`}
                rating={movieData?.Ratings?.[0]?.Value}
                id={favouritesList.find(m => m.title === movieData?.Title)?.id}
              >
                <AnimatedSubscribeButton
                  className={`bg-[#5fa2fa] text-white`}
                  subscribeStatus={isFavourited}
                >
                  <span className="group inline-flex items-center">
                    Add to Favourites
                    <ChevronRightIcon />
                  </span>
                  <span className="group inline-flex items-center">
                    <CheckIcon />
                    Added !
                  </span>
                </AnimatedSubscribeButton>
              </HeartFavourites>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MovieDescription