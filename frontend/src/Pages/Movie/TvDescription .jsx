import MoviesDetailsSkeleton from "../../components/skeletons/MoviesDetailsSkeleton.jsx"
import { AnimatedSubscribeButton } from '../../components/ui/AnimatedButton'
import HeartFavourites from "../../components/Cards/HeartFavourites.jsx";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import api from "../../lib/axiosInstance.js";
import { Frown, Star, Clock, Calendar, Clapperboard, Users, MonitorPlay, ChevronRightIcon, CheckIcon } from "lucide-react"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

const TvDescription = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tvData, setTvData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const id = searchParams.get("id");
  const navigate = useNavigate();


  useEffect(() => {
    const controller = new AbortController();

    const getTVDetails = async () => {
      try {
        setErrorMessage("");
        const response = await api.post("/explore/tv-result", {
          "id": id
        }, { signal: controller.signal });

        setTvData(response.data?.data);
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
      } finally {
        setLoading(false);
      }
    }
    getTVDetails();

    return () => controller.abort();
  }, [id])


  if (loading) {
    return (
      <MoviesDetailsSkeleton />
    )
  }

  if (errorMessage.length !== 0) {
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

  const backdrop_url = tvData.backdrop;

  return (
    <section className="mt-16 min-h-screen">
      {/* Hero Section */}
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
              {tvData?.title}
            </h1>

            <p className="text-slate-300 sm:text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
              {tvData?.overview}
            </p>

            <div className="flex items-center gap-4 pt-8 sm:justify-start justify-center">
              <HeartFavourites
                SVGClassName={"hidden"}
              >
                <AnimatedSubscribeButton
                  className={`bg-[#5fa2fa] text-white`}
                  subscribeStatus={false}
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
        </motion.div>
      </section>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
        <div className="flex flex-col-reverse md:flex-row gap-12 items-start">
          <div className="flex-1 w-full space-y-10">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">TV Series Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm mb-1">Status</span>
                  <span className="text-white font-medium">{tvData?.status}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm mb-1">Release Date</span>
                  <span className="text-white font-medium">{tvData?.release_date}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm mb-1">Runtime</span>
                  <span className="text-white font-medium">{`${tvData?.runtime} min`}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm mb-1">Rating</span>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <span className="text-yellow-500">★</span> {tvData?.rating}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-sm block mb-3">Genres</span>
              <div className="flex gap-3 flex-wrap">
                {tvData?.genres?.map((genre, index) => (
                  <span key={index} className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-200">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {tvData?.production_company && (
              <div>
                <span className="text-slate-400 text-sm block mb-3">Production</span>
                <div className="flex items-center gap-4 bg-[#1e293b] p-4 rounded-xl w-fit border border-slate-700">
                  <div className="bg-white p-2 rounded-lg">
                    <img
                      src={tvData.production_company.logo}
                      alt={tvData.production_company.name}
                      className="h-8 object-contain"
                    />
                  </div>
                  <span className="text-white text-sm font-medium pr-4">{tvData.production_company.name}</span>
                </div>
              </div>
            )}
          </div>

          <div className="w-full md:w-[300px] lg:w-[350px] flex justify-center md:justify-end shrink-0">
            <img
              src={tvData?.poster}
              alt={tvData?.title}
              className="w-64 sm:w-80 md:w-full rounded-xl shadow-2xl shadow-black/40 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Creators Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 border-t border-slate-800">
        <h2 className="text-2xl font-semibold text-white mb-8">Creators</h2>
        <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {tvData?.creators?.map((creator, index) => (
            <div key={index} className="min-w-[160px] w-[160px] snap-start flex flex-col bg-slate-800/40 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
              <img
                src={creator?.picture}
                alt={creator?.real_name}
                className="w-full h-52 object-cover object-top"
              />
              <div className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="text-white text-sm font-bold truncate">{creator?.real_name}</h3>
                <p className="text-blue-400 text-xs mt-1 truncate">{creator?.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasons Section (Slightly Larger Cards) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 border-t border-slate-800">
        <h2 className="text-2xl font-semibold text-white mb-8">Seasons</h2>
        <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {tvData?.seasons?.map((season, index) => (
            <div key={index} className="min-w-[200px] w-[200px] sm:min-w-[220px] sm:w-[220px] snap-start flex flex-col bg-slate-800/40 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
              <img 
                src={season?.poster_path} 
                alt={season?.name} 
                className="w-full h-72 sm:h-80 object-cover object-center" 
              />
              <div className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="text-white text-base font-bold truncate">{season?.name}</h3>
                <p className="text-slate-400 text-sm mt-1 truncate">{season?.episode_count} Episodes</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cast Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 border-t border-slate-800">
        <h2 className="text-2xl font-semibold text-white mb-8">Top Cast</h2>
        <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {tvData?.cast?.map((castMember, index) => (
            <div key={index} className="min-w-[160px] w-[160px] snap-start flex flex-col bg-slate-800/40 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
              <img 
                src={castMember?.picture} 
                alt={castMember?.real_name} 
                className="w-full h-52 object-cover object-top" 
              />
              <div className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="text-white text-sm font-bold truncate">{castMember?.real_name} </h3>
                <p className="text-slate-400 text-xs mt-1 truncate">{castMember?.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trailer Section */}
      {tvData?.trailer && (
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 mb-16 border-t border-slate-800">
          <h2 className="text-2xl font-semibold text-white mb-8">Trailer</h2>

          <div className="w-full max-w-5xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 bg-black">
            <iframe
              width="100%"
              height="100%"
              src={tvData.trailer}
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