import MoviesDetailsSkeleton from "../../components/skeletons/MoviesDetailsSkeleton.jsx"
import { AnimatedSubscribeButton } from '../../components/ui/AnimatedButton'
import HeartFavourites from "../../components/Cards/HeartFavourites.jsx";
import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from "react-router-dom";
import api from "../../lib/axiosInstance.js"
import { toast } from 'react-toastify';
import { Frown, Star, Clock, Calendar, Clapperboard, Users, MonitorPlay, ChevronRightIcon, CheckIcon } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useFavouritesStore } from "../../store/FavouritesStore.js"


const MovieDescription = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movieData, setMovieData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const id = searchParams.get("id");
  const navigate = useNavigate();

  const { favouritesList, addFavourites, removeFavourites } = useFavouritesStore();

  useEffect(() => {
    const controller = new AbortController();

    const getMovieDetails = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        const response = await api.post("/explore/movie-result", {
          "id": id
        }, { signal: controller.signal });

        setMovieData(response.data?.data);
        setLoading(false)
        toast.success(`Fetched data succesfully`);
      } catch (error) {
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
    }
    getMovieDetails();

    return () => controller.abort();
  }, [id])

  const isFavourited = useMemo(() => {
    return favouritesList.some((movie) => (String(movie.id) === String(movieData?.id) && movie.type === movieData?.type))
  }, [favouritesList, movieData?.id, movieData?.type]);

  if (loading) {
    return (
      <MoviesDetailsSkeleton />
    )
  }

  if (errorMessage.length !== 0) {
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

  const backdrop_url = movieData.backdrop;

  return (
    <section className="mt-16 min-h-screen">
      <section
        className="relative w-full h-[80dvh] bg-cover bg-center"
        style={{
          backgroundImage:
            `url('${backdrop_url}')`,
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
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
        <div className="flex flex-col-reverse md:flex-row gap-12 items-start">
          <div className="flex-1 w-full space-y-10">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Movie Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm mb-1">Status</span>
                  <span className="text-white font-medium">{movieData?.status}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm mb-1">Release Date</span>
                  <span className="text-white font-medium">{movieData?.release_date}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm mb-1">Runtime</span>
                  <span className="text-white font-medium">{`${movieData?.runtime} min`}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm mb-1">Rating</span>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <span className="text-yellow-500">★</span> {movieData?.rating}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm mb-1">Budget</span>
                  <span className="text-white font-medium">{`$ ${movieData?.budget}`}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm mb-1">IMDb ID</span>
                  <span className="text-white font-medium">{movieData?.imdb_id}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-sm block mb-3">Genres</span>
              <div className="flex gap-3 flex-wrap">
                {movieData?.genres?.map((genres, index) => (
                  <span key={index} className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-200">
                    {genres}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-sm block mb-3">Production</span>
              <div className="flex items-center gap-4 bg-[#1e293b] p-4 rounded-xl w-fit border border-slate-700">
                <div className="bg-white p-2 rounded-lg">
                  <img
                    src={movieData?.production_company?.logo}
                    alt={movieData?.production_company?.name}
                    className="h-8 object-contain"
                  />
                </div>
                <span className="text-white text-sm font-medium pr-4">{movieData?.production_company?.name}</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[300px] lg:w-[350px] flex justify-center md:justify-end shrink-0">
            <img
              src={movieData?.poster}
              alt={movieData?.title}
              className="w-64 sm:w-80 md:w-full rounded-xl shadow-2xl shadow-black/40 object-cover"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 border-t border-slate-800">
        <h2 className="text-2xl font-semibold text-white mb-8">Top Cast & Crew</h2>
        <div className="flex  overflow-x-auto gap-6 pb-6  scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="min-w-[160px] w-[160px] flex flex-col bg-slate-800/40 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
            <img
              src={movieData?.director?.picture}
              alt={movieData?.director?.real_name}
              className="w-full h-52 object-cover object-top"
            />
            <div className="p-4 flex-1 flex flex-col justify-center">
              <h3 className="text-white text-sm font-bold truncate">{movieData?.director?.real_name}</h3>
              <p className="text-blue-400 text-xs mt-1 truncate">{movieData?.director?.role}</p>
            </div>
          </div>

          {movieData?.cast?.map((casts, index) => (
            <div key={index} className="min-w-[160px] w-[160px] flex flex-col bg-slate-800/40 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
              <img src={casts?.picture} alt={casts?.real_name} className="w-full h-52 object-cover object-top" />
              <div className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="text-white text-sm font-bold truncate">{casts?.real_name} </h3>
                <p className="text-slate-400 text-xs mt-1 truncate">{casts?.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {movieData?.trailer && (
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 mb-16 border-t border-slate-800">
          <h2 className="text-2xl font-semibold text-white mb-8">Trailer</h2>

          <div className="w-full max-w-5xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 bg-black">
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
