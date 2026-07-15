import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CardSection from '../components/Cards/CardSection'
import api from "../lib/axiosInstance.js"
import Loading from "../components/Loading.jsx"
import { toast } from 'react-toastify'

const Home = () => {
  const naviagte = useNavigate();

  const [hollywoodData, setHollywoodData] = useState([]);
  const [bollywoodData, setBollywoodData] = useState([]);
  const [webSeriesData, setWebSeriesData] = useState([]);

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController();

    const getTrendingData = async () => {
      setLoading(true);
      try {
        const response = await api.get("/get-dashboard-data",{ signal: controller.signal });

        setHollywoodData(response?.data?.data?.hollywood);
        setBollywoodData(response?.data?.data?.bollywood);
        setWebSeriesData(response?.data?.data?.webSeries);

      } catch (error) {
        if (error.name === "CanceledError" || error.code === "ERR_CANCELED") return;
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
        setLoading(false)
      }
    }
    getTrendingData();

    return () => controller.abort();
  }, [])

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <section className='w-full p-2 space-y-10 sm:p-7 mt-17'>
      <div className="relative w-full h-[60vh] sm:bg-cover bg-cover bg-top rounded-3xl" style={{ backgroundImage: "url('https://images4.alphacoders.com/140/thumb-1920-1407245.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-3xl"></div>
        <div className="relative h-full flex flex-col justify-end p-8 md:p-12 text-white ">
          <div className="max-w-2xl ">
            <h1 className="text-xl md:text-5xl sm:text-nowrap font-black tracking-tight drop-shadow-lg text-white/90 hover:text-[#5fa2fa] duration-300 "
              onClick={() => { naviagte('/explore/Spider-Man: Brand New Day') }}
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
              className="w-fit flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform hover:scale-105 shadow-lg">
              <span>Watch Trailer</span>
            </a>
          </div>
        </div>
      </div>

      {/* Trending and Bollywood section */}
      <div className='space-y-6'>
        <CardSection movieList={hollywoodData} name={`Hollywood`} />
        <CardSection movieList={bollywoodData} name={`Bollywood`} />
        <CardSection movieList={webSeriesData} name={`Web series`} />
      </div>
    </section>
  )
}

export default Home
