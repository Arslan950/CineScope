import React, { useEffect } from 'react'
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from 'react-router-dom'
import CardSection from '../components/Cards/CardSection'
import api from "../lib/axiosInstance.js"
import HomeSkeleton from "../components/skeletons/HomeSkeleton.jsx"
import { toast } from 'react-toastify'
import { motion } from 'motion/react'
import { Info, Star, TrendingUp } from 'lucide-react'

const Home = () => {
  const navigate = useNavigate();

  const { data: dashboardData, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard_data'],
    queryFn: async ({ signal }) => {
      const response = await api.get("/get-dashboard-data", { signal });
      return response?.data?.data;
    },
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (isError && error) {
      if (error.name === "CanceledError" || error.code === "ERR_CANCELED") return;

      if (error.response) {
        toast.error(error.response?.data?.message || "Server Error");
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  }, [isError, error])


  if (isLoading) {
    return (
      <HomeSkeleton />
    )
  }

  return (
    <section className='w-full mt-16'>
      <section
        className="relative w-full h-[65vh] sm:h-[80vh] bg-cover bg-center"
        style={{
          backgroundImage:
            `url('${dashboardData?.hollywood[0].backdrop}')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t bg-gradient-to-r from-black/60 via-black/40 to-transparen" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute bottom-6 left-0 w-full px-6 sm:bottom-10 sm:left-8 sm:p-4 sm:w-auto"
        >
          <div className="max-w-3xl">
            <span className="flex items-center gap-x-2 sm:text-lg text-sm font-semibold text-emerald-400 mb-2">
              <TrendingUp size={18} strokeWidth={2.5} />
              Trending #1 today
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-left mb-2">
              {dashboardData?.hollywood[0].title}
            </h1>

            <span className="flex items-center gap-x-2 text-sm text-white/90">
              <Star size={18} className="fill-amber-400 stroke-0" />
              <p className="font-medium">{dashboardData?.hollywood[0].rating}</p>
              <span className="text-white/40">•</span>
              <p className="capitalize">{dashboardData?.hollywood[0].type}</p>
            </span>

            <p className="text-white/90 text-sm sm:text-xl mt-3 leading-relaxed">
              {dashboardData?.hollywood[0].overview}
            </p>

            <div className="flex items-center gap-4 pt-8 justify-start">
              <button
                onClick={() => navigate(`/explore/movie?id=${dashboardData?.hollywood[0]?.id}`)}
                className="flex items-center gap-x-2 rounded-lg bg-[#5fa2fa] px-5 py-3 font-semibold transition-colors duration-200 hover:bg-blue-500"
              >
                <Info size={20} />
                More info
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      <div className='space-y-6 sm:p-7 p-2'>
        <CardSection movieList={dashboardData?.hollywood.slice(1, 6)} name={`Hollywood`} />
        <CardSection movieList={dashboardData?.bollywood} name={`Bollywood`} />
        <CardSection movieList={dashboardData?.webSeries} name={`Web series`} />
      </div>
    </section>
  )
}

export default Home;
