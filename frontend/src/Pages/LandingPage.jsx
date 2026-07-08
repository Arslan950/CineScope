import { ThreeDMarquee } from "../components/ui/3d-marquee.jsx";
import { images } from "../MoviesDB/moviesList.js";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ChevronRightIcon } from "lucide-react";


const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-[100dvh] overflow-hidden">
      <ThreeDMarquee images={images} className="min-h-[100dvh] rounded-none" />

      <div className="absolute inset-0 w-full flex items-center justify-center bg-black/60 dark:bg-black/70">
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl px-6 text-center text-white gap-y-4 mb-25">
          <h1 className="text-4xl font-semibold md:text-5xl lg:text-6xl drop-shadow-xl whitespace-normal xl:whitespace-nowrap">
            Explore the World of Cinema
          </h1>
          <p className="text-lg font-semibold text-white/90 md:text-xl lg:text-2xl drop-shadow-md">
            Find classics, discover new favorites, and curate your film collection.
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 p-4 mt-7 text-white sm:text-lg font-semibold bg-[#5fa2fa] rounded-2xl sm:px-6 sm:py-4"
          >
            Get Started
            <ChevronRightIcon />
          </motion.button>

        </div>
      </div>
    </section>
  )
}

export default LandingPage ;
