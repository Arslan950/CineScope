'use client';
import React from 'react';
import { useState } from 'react';
import { ProgressiveBlur } from '../ui/progressive-blur';
import { motion } from 'framer-motion'; // Corrected the import for motion
import { useNavigate } from 'react-router-dom';
import HeartFavourites from './HeartFavourites';

export default React.memo(function Card({ id, title, poster, rating, visiblity }) {
  const [isHover, setIsHover] = useState(false);
  const naviagte = useNavigate();

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        naviagte(`/explore/${encodeURIComponent(title)}`);
      }}
      className='relative my-4 flex-shrink-0 sm:h-[340px] sm:w-[240px] h-[245px] w-[175px] overflow-hidden sm:rounded-3xl rounded-2xl dark:ring-1 dark:ring-white/75 ring-1 ring-black'
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <img
        src={poster}
        alt='Poster'
        className='absolute inset-0 h-full w-full object-cover'
      />
      <ProgressiveBlur
        className='pointer-events-none absolute bottom-0 left-0 h-[75%] w-full rounded-3xl'
        blurIntensity={1}
        animate={isHover ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
      <motion.div
        className='absolute bottom-0 left-0'
        animate={isHover ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div className='flex flex-col items-start gap-0 px-5 py-4'>
          <p className='text-xl font-semibold text-white duration-300 hover:text-[#5fa2fa]'>{title}</p>
          <span className='text-white'>⭐ {rating}</span>
        </div>
      </motion.div>
      <motion.div
        className='absolute bottom-0 right-0'
        animate={isHover ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: visiblity },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div className='px-5 py-3'>
          <HeartFavourites id={id} title={title} poster={poster} rating={rating} />
        </div>
      </motion.div>
    </div>
  );
});