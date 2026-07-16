import MoviesDetailsSkeleton from "../../components/skeletons/MoviesDetailsSkeleton.jsx"
import { AnimatedSubscribeButton } from '../../components/ui/AnimatedButton'
import HeartFavourites from "../../components/Cards/HeartFavourites.jsx";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import api from "../../lib/axiosInstance.js"
import { toast } from 'react-toastify';
import { Frown, Star, Clock, Calendar, Clapperboard, Users, MonitorPlay , ChevronRightIcon , CheckIcon } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'


const MovieDescription = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movieData, setMovieData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const id = searchParams.get("id");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const getMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await api.post("/explore/movie-result", {
          "id": id
        }, { signal: controller.signal });

        setMovieData(response.data?.data);
        toast.success(`Fetched data succesfully`);
      } catch (error) {
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
    getMovieDetails();

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
          <h1 className="sm:text-4xl text-2xl font-semibold">No movie/series found</h1>
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

  const backdrop_url = movieData.backdrop ;

  return (
    <section className="mt-16 min-h-screen bg-pdink-400">
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
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
          <div className="flex flex-col-reverse md:flex-row gap-12 items-start">
            
            {/* Left Column: Stats & Information */}
            <div className="flex-1 w-full space-y-10">
              
              {/* Core Stats Grid */}
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

              {/* Genres */}
              <div>
                <span className="text-slate-400 text-sm block mb-3">Genres</span>
                <div className="flex gap-3 flex-wrap">
                  <span className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-200">
                    Drama
                  </span>
                  <span className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-200">
                    Thriller
                  </span>
                </div>
              </div>

              {/* Production Companies */}
              <div>
                <span className="text-slate-400 text-sm block mb-3">Production</span>
                <div className="flex items-center gap-4 bg-[#1e293b] p-4 rounded-xl w-fit border border-slate-700">
                  <div className="bg-white p-2 rounded-lg">
                    <img 
                      src="https://image.tmdb.org/t/p/w200/tEiIH5QesdheJmDAqQwvtN60727.png" 
                      alt="Fox 2000 Pictures" 
                      className="h-8 object-contain" 
                    />
                  </div>
                  <span className="text-white text-sm font-medium pr-4">Fox 2000 Pictures</span>
                </div>
              </div>
            </div>

            {/* Right Column: Poster */}
            <div className="w-full md:w-[300px] lg:w-[350px] flex justify-center md:justify-end shrink-0">
              <img
                src="https://image.tmdb.org/t/p/w400/jSziioSwPVrOy9Yow3XhWIBDjq1.jpg"
                alt="Fight Club Poster"
                className="w-64 sm:w-80 md:w-full rounded-xl shadow-2xl shadow-black/40 object-cover"
              />
            </div>
          </div>
        </div>

        {/* --- TOP CAST & DIRECTOR SECTION --- */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 border-t border-slate-800">
          <h2 className="text-2xl font-semibold text-white mb-8">Top Cast & Crew</h2>
          
          <div className="flex  overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            
            {/* Director Card */}
            <div className="min-w-[160px] w-[160px] snap-start flex flex-col bg-slate-800/40 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
              <img 
                src="https://image.tmdb.org/t/p/w200/tpEczFclQZeKAiCeKZZ0adRvtfz.jpg" 
                alt="David Fincher" 
                className="w-full h-52 object-cover object-top" 
              />
              <div className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="text-white text-sm font-bold truncate">David Fincher</h3>
                <p className="text-blue-400 text-xs mt-1 truncate">Director</p>
              </div>
            </div>

            {/* Cast Cards */}
            <div className="min-w-[160px] w-[160px] snap-start flex flex-col bg-slate-800/40 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
              <img src="https://image.tmdb.org/t/p/w200/8nytsqL59SFJTVYVrN72k6qkGgJ.jpg" alt="Edward Norton" className="w-full h-52 object-cover object-top" />
              <div className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="text-white text-sm font-bold truncate">Edward Norton</h3>
                <p className="text-slate-400 text-xs mt-1 truncate">Narrator</p>
              </div>
            </div>

            <div className="min-w-[160px] w-[160px] snap-start flex flex-col bg-slate-800/40 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
              <img src="https://image.tmdb.org/t/p/w200/m09Y1YfPPeNYYUSHnnVqahkrC1o.jpg" alt="Brad Pitt" className="w-full h-52 object-cover object-top" />
              <div className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="text-white text-sm font-bold truncate">Brad Pitt</h3>
                <p className="text-slate-400 text-xs mt-1 truncate">Tyler Durden</p>
              </div>
            </div>

            <div className="min-w-[160px] w-[160px] snap-start flex flex-col bg-slate-800/40 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
              <img src="https://image.tmdb.org/t/p/w200/hJMbNSPJ2PCahsP3rNEU39C8GWU.jpg" alt="Helena Bonham Carter" className="w-full h-52 object-cover object-top" />
              <div className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="text-white text-sm font-bold truncate">Helena B. Carter</h3>
                <p className="text-slate-400 text-xs mt-1 truncate">Marla Singer</p>
              </div>
            </div>

            <div className="min-w-[160px] w-[160px] snap-start flex flex-col bg-slate-800/40 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
              <img src="https://image.tmdb.org/t/p/w200/1zkohpaG3my4qQAZGVgzgPuXwZ6.jpg" alt="Meat Loaf" className="w-full h-52 object-cover object-top" />
              <div className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="text-white text-sm font-bold truncate">Meat Loaf</h3>
                <p className="text-slate-400 text-xs mt-1 truncate">Robert Paulson</p>
              </div>
            </div>

            <div className="min-w-[160px] w-[160px] snap-start flex flex-col bg-slate-800/40 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
              <img src="https://image.tmdb.org/t/p/w200/ca3x0OfIKbJppZh8S1Alx3GfUZO.jpg" alt="Jared Leto" className="w-full h-52 object-cover object-top" />
              <div className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="text-white text-sm font-bold truncate">Jared Leto</h3>
                <p className="text-slate-400 text-xs mt-1 truncate">Angel Face</p>
              </div>
            </div>
            
            <div className="min-w-[160px] w-[160px] snap-start flex flex-col bg-slate-800/40 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
              <img src="https://image.tmdb.org/t/p/w200/xHnvYcJv6YEku9pIg8LoDNHWQy.jpg" alt="Holt McCallany" className="w-full h-52 object-cover object-top" />
              <div className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="text-white text-sm font-bold truncate">Holt McCallany</h3>
                <p className="text-slate-400 text-xs mt-1 truncate">The Mechanic</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- TRAILER SECTION --- */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 mb-16 border-t border-slate-800">
          <h2 className="text-2xl font-semibold text-white mb-8">Trailer</h2>
          
          <div className="w-full max-w-5xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 bg-black">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dfeUzm6KF4g?rel=0"
              title="Fight Club Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
    </section>

  )
}

export default MovieDescription;
