"use client";
import { ChevronRightIcon } from "lucide-react";
import { ThreeDMarquee } from "../components/ui/3d-marquee";
import { images } from "../MoviesDB/moviesList";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
export function ThreeDMarqueeDemo() {
    const navigate = useNavigate()
    return (
        <>
            <div
                className="relative mx-auto sm:flex h-screen w-full flex-col items-center justify-center hidden">
                <h2
                    className="relative z-20 mx-auto max-w-4xl text-center text-2xl font-bold text-balance text-white md:text-4xl lg:text-6xl">
                    Explore the World of Cinema
                </h2>
                <p
                    className="relative z-20 mx-auto max-w-2xl py-8 text-center text-sm text-neutral-200 md:text-base">
                    Find classics, discover new favorites, and curate your film collection.
                </p>
                <div
                    className="relative z-20 flex flex-wrap items-center justify-center gap-4 pt-4">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/home')}
                        className='group bg-[#5fa2fa] text-white sm:p-4 rounded-2xl  sm:text-lg font-semibold p-2 flex items-center'
                    >
                        Get Started
                        <ChevronRightIcon />
                    </motion.button>
                </div>
                <div
                    className="absolute inset-0 z-10 h-full w-full bg-black/60 dark:bg-black/40 " />
                <ThreeDMarquee
                    className="pointer-events-none absolute inset-0 h-full w-full bg-slate-100 dark:bg-[#111826]  sm:block hidden"
                    images={images} />
            </div>

            {/* {mobile} */}
            <div className="min-h-screen w-full relative sm:hidden">
                <div
                    className="absolute inset-0 z-0 bg-[radial-gradient(125%_125%_at_50%_10%,#f1f5f9_40%,#7c3aed_100%)] dark:bg-[radial-gradient(125%_125%_at_50%_10%,#111826_40%,#7c3aed_100%)]"
                />
                <div
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-y-6 p-2 w-full">
                    <h1 className="sm:text-6xl text-3xl font-semibold text-center text-black dark:text-white">Explore the World of Cinema</h1>
                    <p className="sm:text-xl text-center text-slate-900 dark:text-white/90">Find classics, discover new favorites, and curate your film collection.</p>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/home')}
                        // Added 'group' for the icon's hover effect and 'text-white' for better contrast
                        className='group bg-[#5fa2fa] text-white sm:p-4 rounded-2xl sm:mt-10 sm:text-lg font-semibold p-3 flex items-center'
                    >
                        Get Started
                        <ChevronRightIcon className="ml-2 size-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </motion.button>
                </div>
            </div>
        </>
    );
}
