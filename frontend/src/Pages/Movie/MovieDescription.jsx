import MoviesDetailsSkeleton from "../../components/skeletons/MoviesDetailsSkeleton.jsx"
import { AnimatedSubscribeButton } from '../../components/ui/AnimatedButton'
import HeartFavourites from "../../components/Cards/HeartFavourites.jsx";
import CastCard from "../../components/Cards/CastCard.jsx";
import RatingChart from "../../components/charts/RatingChart.jsx";
import BudgetRevenueChart from "../../components/charts/BudgetRevenueChart.jsx";
import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from "react-router-dom";
import api from "../../lib/axiosInstance.js"
import { toast } from 'react-toastify';
import { Frown, Star, Clock, Calendar, Clapperboard, Users, MonitorPlay, ChevronRightIcon, CheckIcon, SquareArrowOutUpRight } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useFavouritesStore } from "../../store/FavouritesStore.js"
import { useQuery } from "@tanstack/react-query"


const MovieDescription = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate();

  const favouritesList = useFavouritesStore((state) => state.favouritesList);
  const addFavourites = useFavouritesStore((state) => state.addFavourites);
  const removeFavourites = useFavouritesStore((state) => state.removeFavourites);

  const { data: movieData, isLoading, isError, error } = useQuery({
    queryKey: ['movieData', id],
    queryFn: async ({ signal }) => {
      const response = await api.post("/explore/movie-result", {
        "id": id
      }, { signal });

      return response.data?.data
    },
    staleTime: 3 * 60 * 1000,
  });

  useEffect(() => {
    if (isError && error) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        return;
      }
      if (error.response) {
        const backendMessage = error.response?.data?.message
        setErrorMessage(backendMessage)
        toast.error(backendMessage);
      } else if (error.request) {
        const networkMsg = "Network error. Please check your connection.";
        setErrorMessage(networkMsg);
        toast.error(networkMsg);
      } else {
        const unexpectedMsg = "An unexpected error occurred.";
        setErrorMessage(unexpectedMsg);
        toast.error(unexpectedMsg);
      }
    }
  }, [isError, error])

  const isFavourited = useMemo(() => {
    return favouritesList.some((movie) => (String(movie.id) === String(movieData?.id) && movie.type === movieData?.type))
  }, [favouritesList, movieData?.id, movieData?.type]);

  if (isLoading) {
    return (
      <MoviesDetailsSkeleton />
    )
  }

  if (isError && error) {
    return (
      <div className="mt-30 flex flex-col items-center gap-y-10">
        <div className="flex items-center justify-center gap-x-2">
          <h1 className="sm:text-4xl text-2xl font-semibold">No movie found</h1>
          <Frown size={35} />
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/search')}
          className='bg-[#5fa2fa] text-white font-semibold sm:text-lg sm:p-3 p-1.5 rounded-xl '
        >
          Go back to Search
        </motion.button>
      </div>
    )
  }

  function formatRuntime(totalMinutes) {
    if (!totalMinutes) return "N/A";

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const hourString = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : '';
    const minuteString = minutes > 0 ? `${minutes} min` : '';

    return `${hourString} ${minuteString}`.trim();
  }

  const stats = [
    {
      stat_title: "Status",
      stat_data: movieData?.status
    },
    {
      stat_title: "Release Date",
      stat_data: movieData?.release_date
    },
    {
      stat_title: "Runtime",
      stat_data: formatRuntime(movieData?.runtime)
    },
    {
      stat_title: "IMDB ID",
      stat_data: movieData?.imdb_id
    }
  ];

  return (
    <section className="mt-16 min-h-screen">
      {/* hero section */}
      <section
        className="relative w-full h-[65vh] sm:h-[80vh] bg-cover bg-center"
        style={{
          backgroundImage:
            `url('${movieData?.backdrop}')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#111826] via-[#111826]/80 sm:via-[#111826]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111826]/90 sm:from-[#111826]/80 via-[#111826]/40 sm:via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute bottom-6 left-0 w-full px-6 sm:bottom-10 sm:left-8 sm:p-4 sm:w-auto"
        >
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-left">
              {movieData?.title}
            </h1>

            <p className="text-slate-300 sm:text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
              {movieData?.overview}
            </p>

            <div className="flex items-center gap-4 pt-8 sm:justify-start justify-center">
              <HeartFavourites
                SVGClassName={"hidden"}
                id={movieData?.id}
                title={movieData?.title}
                poster={movieData?.poster}
                rating={movieData?.rating}
                type={movieData?.type}
              >
                <AnimatedSubscribeButton
                  className={`bg-[#5fa2fa] text-white`}
                  subscribeStatus={isFavourited}
                >
                  <span className="group inline-flex items-center">
                    Add to Favourites
                    <ChevronRightIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="group inline-flex items-center">
                    <CheckIcon />
                    Added !
                  </span>
                </AnimatedSubscribeButton>
              </HeartFavourites>
            </div>
          </div>
        </motion.div>
      </section>
      {/* stats */}
      <section className="xl:max-w-[75%] xl:mx-auto p-4 mb-16 mt-10 flex ">

      </section>
      {/* Cast and crew */}
      {movieData?.cast.length != 0 && (<section className="sm:max-w-[80%] mx-auto p-4 mb-16 border-t border-slate-800">
        <h2 className="sm:text-3xl text-2xl font-semibold mb-8">Cast and Crew</h2>
        <div className="flex items-center gap-x-5 overflow-x-scroll">
          <CastCard
            name={movieData?.director?.real_name}
            role={movieData?.director?.role}
            picture={movieData?.director?.picture}
          />
          {movieData?.cast?.map((casts) => (
            <CastCard
              key={casts?.real_name}
              picture={casts?.picture}
              name={casts?.real_name}
              role={casts?.role}
            />
          ))}
        </div>
      </section>)}
      {/* trailer */}
      {movieData?.trailer && (
        <div className="sm:max-w-[80%] max-w-7xl mx-auto p-4 mb-16 border-t border-slate-800">
          <h2 className="sm:text-3xl text-2xl font-semibold mb-8">Trailer</h2>
          <div className="w-full max-w-7xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 bg-black">
            <iframe
              width="100%"
              height="100%"
              src={movieData?.trailer}
              title={`${movieData?.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      )}
    </section>
  )
}

export default MovieDescription;
