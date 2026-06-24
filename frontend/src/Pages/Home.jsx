import React from 'react'
import { useNavigate } from 'react-router-dom'
import CardSection from '../components/Cards/CardSection'
import { Trending, Bollywood , webseries} from '../MoviesDB/moviesList'

const Home = () => {
  const naviagte = useNavigate()
  return (
    <section className='w-full p-2 space-y-10 sm:p-7'>
      <div className="relative w-full h-[60vh] sm:bg-cover bg-cover bg-top rounded-3xl" style={{ backgroundImage: "url('https://images4.alphacoders.com/138/1385846.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-3xl"></div>
        <div className="relative h-full flex flex-col justify-end p-8 md:p-12 text-white ">
          <div className="max-w-2xl ">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight drop-shadow-lg text-white/90 hover:text-[#5fa2fa] duration-300 "
              onClick={() => { naviagte('/explore/Superman') }}
            >SUPERMAN</h1>
            <div className="flex items-center space-x-4 mt-4 mb-6">
              <div className="flex items-center space-x-1">
                <span className="text-xl font-bold text-white/90"></span>
              </div>
              <span className="text-gray-300">2025 | Action/Sci-Fi | 2h 31m</span>
            </div>
            <a
              href='https://youtu.be/Ox8ZLF6cGM0?si=mZEJzlu3XpEoSYXa'
              target='_main'
              className="w-fit flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform hover:scale-105 shadow-lg">
              <span>Watch Trailer</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Trending and Bollywood section */}
      <div className='space-y-6'>
        <CardSection movieList={Trending} name={`Trending`} />
        <CardSection movieList={Bollywood} name={`Bollywood hits`} />
        <CardSection movieList={webseries} name={`Web series hits`} />
      </div>
    </section>
  )
}

export default Home
