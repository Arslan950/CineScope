import React, { useState, useEffect } from 'react'
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from 'react-router-dom'
import CardSection from '../components/Cards/CardSection'
import api from "../lib/axiosInstance.js"
import HomeSkeleton from "../components/skeletons/HomeSkeleton.jsx"
import { toast } from 'react-toastify'

const Home = () => {
  const navigate = useNavigate();

  const { data: dashboardData, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard_data'],
    queryFn: async ({signal}) => {
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
    <section className='w-full p-2 space-y-10 sm:p-7 mt-17'>
      <div className="relative w-full h-[60vh] sm:bg-cover bg-cover bg-top rounded-3xl" style={{ backgroundImage: "url('https://images4.alphacoders.com/140/thumb-1920-1407245.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-3xl"></div>
        <div className="relative h-full flex flex-col justify-end p-8 md:p-12 text-white ">
          <div className="max-w-2xl ">
            <h1 className="text-xl md:text-5xl sm:text-nowrap font-black tracking-tight drop-shadow-lg text-white/90 hover:text-[#5fa2fa] duration-300 "
              onClick={() => { navigate('/explore/movie?id=969681') }}
            >Spider-Man: Brand New Day</h1>
            <div className="flex items-center space-x-4 mt-4 mb-6">
              <div className="flex items-center space-x-1">
                <span className="text-xl font-bold text-white/90"></span>
              </div>
              <span className="text-gray-300">2026 | Action | 2h 30m</span>
            </div>
            <a
              href='https://www.youtube.com/watch?v=8TZMtslA3UY'
              target='_main'
              className="w-fit flex items-center space-x-2 bg-[#5fa2fa] hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-transform hover:scale-105 shadow-lg">
              <span>Watch Trailer</span>
            </a>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        <CardSection movieList={dashboardData?.hollywood} name={`Hollywood`} />
        <CardSection movieList={dashboardData?.bollywood} name={`Bollywood`} />
        <CardSection movieList={dashboardData?.webSeries} name={`Web series`} />
      </div>
    </section>
  )
}

export default Home;
