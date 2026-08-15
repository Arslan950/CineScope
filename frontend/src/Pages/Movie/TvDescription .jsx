import TvDetailsSkeleton from "../../components/skeletons/TvDetailsSkeleton.jsx"
import { AnimatedSubscribeButton } from '../../components/ui/AnimatedButton'
import HeartFavourites from "../../components/Cards/HeartFavourites.jsx";
import CastCard from "../../components/Cards/CastCard.jsx";
import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from "react-router-dom";
import api from "../../lib/axiosInstance.js";
import { Frown, Star, Clock, Calendar, Clapperboard, Users, MonitorPlay, ChevronRightIcon, CheckIcon } from "lucide-react"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useFavouritesStore } from "../../store/FavouritesStore.js"
import { useQuery } from "@tanstack/react-query";

const TvDescription = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate();

  const favouritesList = useFavouritesStore((state) => state.favouritesList);
  const addFavourites = useFavouritesStore((state) => state.addFavourites);
  const removeFavourites = useFavouritesStore((state) => state.removeFavourites);

  const { data: tvData, isLoading, isError, error } = useQuery({
    queryKey: ['tvData', id],
    queryFn: async ({ signal }) => {
      const response = await api.post("/explore/tv-result", {
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
    return favouritesList.some((movie) => (String(movie.id) === String(tvData?.id) && movie.type === tvData?.type))
  }, [favouritesList, tvData?.id, tvData?.type]);


  if (isLoading) {
    return (
      <TvDetailsSkeleton />
    )
  }

  if (isError && error) {
    return (
      <div className="mt-30 flex flex-col items-center gap-y-10">
        <div className="flex items-center justify-center gap-x-2">
          <h1 className="sm:text-4xl text-2xl font-semibold">No TV Series found</h1>
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

  const stats = [
    {
      icon: <MonitorPlay className="stroke-blue-400" />,
      stat_title: "Status",
      stat_data: tvData?.status
    },
    {
      icon: <Calendar className="stroke-blue-400" />,
      stat_title: "Release Date",
      stat_data: tvData?.release_date
    },
    {
      icon: <Clock className="stroke-blue-400" />,
      stat_title: "Ep Runtime",
      stat_data: tvData?.runtime
    },
    {
      icon: <Clapperboard className="stroke-blue-400" />,
      stat_title: "In production",
      stat_data: String(tvData?.in_production)
    },
    {
      icon: <Users className="stroke-blue-400" />,
      stat_title: "seasons",
      stat_data: tvData?.number_of_seasons
    },
    {
      icon: <Star className="stroke-blue-400" />,
      stat_title: "Total episodes",
      stat_data: tvData?.number_of_episodes
    },
  ];

  return (
    <section className="mt-16 min-h-screen">
      {/* hero section */}
      <section
        className="relative w-full sm:h-[80vh] h-[65vh] bg-cover bg-center"
        style={{
          backgroundImage:
            `url('${tvData.backdrop}')`,
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
              {tvData?.title}
            </h1>

            <p className="text-slate-300 sm:text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
              {tvData?.overview}
            </p>

            <div className="flex items-center gap-4 pt-8 sm:justify-start justify-center">
              <HeartFavourites
                SVGClassName={"hidden"}
                id={tvData?.id}
                title={tvData?.title}
                poster={tvData?.poster}
                rating={tvData?.rating}
                type={tvData?.type}
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
      {/*poster and  stats */}
      <section className="sm:max-w-[75%] mx-auto p-4 mb-16 mt-10 grid xl:grid-cols-[auto_1fr] grid-cols-1 gap-8">
        <div className="sm:w-84 w-70 shrink-0 mx-auto xl:mx-0">
          <img src={tvData?.poster} alt={tvData?.title} className="rounded-xl w-full h-auto shadow-2xl shadow-black" />
        </div>

        <div className="w-full h-full xl:p-6 rounded-xl mx-auto xl:mx-0">
          {/* stats */}
          <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-2 gap-4 md:gap-6">
            {
              stats.map((stat) => (
                <div
                  key={stat.stat_title}
                  className="bg-zinc-600/40 p-3 rounded-xl xl:w-50  w-full sm:h-22 h-25 flex flex-col gap-y-2.5"
                >
                  <span className="flex items-center gap-x-2">
                    {stat.icon}
                    <h2 className="dark:text-white/70 text-black/75 font-semibold">
                      {stat.stat_title}
                    </h2>
                  </span>
                  <p className="font-semibold dark:text-white/88 text-black/88 text-center">
                    {stat.stat_data}
                  </p>
                </div>
              ))
            }
          </div>
          {/* genres */}
          {tvData?.genres.length != 0 && (<div className="flex flex-col gap-y-3 mt-7">
            <h2 className="font-bold dark:text-zinc-50/85">GENRES</h2>
            <div className="flex items-center flex-wrap gap-3">
              {
                tvData?.genres.map((genre) => (
                  <p key={genre} className="bg-zinc-600/40 py-2 px-3 rounded-full border dark:border-white/40 border-black/50">{genre}</p>
                ))
              }
            </div>
          </div>)}
          {/* production */}
          {tvData?.production_company && (<div className="flex flex-col gap-y-3 mt-7">
              <h2 className="font-bold dark:text-zinc-50/85">PRODUCTION</h2>
              <div className="flex items-center gap-x-8">
                <img src={tvData?.production_company?.logo} alt={tvData?.production_company?.name} className="bg-white p-4 rounded-xl w-40"/>
                <p className="text-2xl font-semibold">{tvData?.production_company?.name}</p>
              </div>
          </div>)}
        </div>
      </section>
      {/* creator */}
      {tvData?.creators.length != 0 && (<section className="sm:max-w-[75%] mx-auto p-4 mb-16 border-t border-slate-800">
        <h2 className="sm:text-3xl text-2xl font-semibold mb-8">Creators</h2>
        <div className="flex items-center gap-x-5 overflow-x-auto">
          {tvData?.creators?.map((casts) => (
            <CastCard
              key={casts?.real_name}
              picture={casts?.picture}
              name={casts?.real_name}
              role={casts?.role}
            />
          ))}
        </div>
      </section>)}

      {/* seasons */}
      {tvData.seasons.length != 0 && (<div className="sm:max-w-[75%] max-w-7xl mx-auto p-4 border-t border-slate-800 mb-16">
        <h2 className="sm:text-3xl text-2xl font-semibold mb-8">Seasons</h2>
        <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {tvData?.seasons?.map((season, index) => (
            <div key={index} className="min-w-[200px] w-[200px] sm:min-w-[220px] sm:w-[220px] snap-start flex flex-col dark:bg-zinc-700 bg-slate-50 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
              <img
                src={season?.poster_path}
                alt={season?.name}
                className="w-full h-72 sm:h-80 object-cover object-center"
                loading="lazy"
              />
              <div className="card-body p-3">
                <h3 className="card-title">{season?.name}</h3>
                <p className="text-sm mt-1 truncate">{season?.episode_count} Episodes</p>
              </div>
            </div>
          ))}
        </div>
      </div>)}
      {/* Cast and crew */}
      {tvData?.cast.length != 0 && (<section className="sm:max-w-[75%] mx-auto p-4 mb-16 border-t border-slate-800">
        <h2 className="sm:text-3xl text-2xl font-semibold mb-8">Cast and Crew</h2>
        <div className="flex items-center gap-x-6 overflow-x-auto">
          {tvData?.cast?.map((casts) => (
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
      {tvData?.trailer && (
        <div className="sm:max-w-[75%] max-w-7xl mx-auto p-4 mb-16 border-t border-slate-800">
          <h2 className="sm:text-3xl text-2xl font-semibold mb-8">Trailer</h2>
          <div className="w-full max-w-7xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 bg-black">
            <iframe
              width="100%"
              height="100%"
              src={tvData?.trailer}
              title={`${tvData?.title} Trailer`}
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

export default TvDescription;