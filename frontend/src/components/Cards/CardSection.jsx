import React, { useRef, useState, useEffect } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import Card from '../Cards/Card';

const CardSection = ({ movieList, name }) => {
  const scrollRef = useRef(null);

  const [isScrolledLeft, setIsScrolledLeft] = useState(true);
  const [isScrolledRight, setIsScrolledRight] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setIsScrolledLeft(scrollLeft <= 0);
      setIsScrolledRight(Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 1);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    handleScroll();
    const ro = new ResizeObserver(handleScroll);
    ro.observe(el);
    return () => ro.disconnect();
  }, [movieList]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -(clientWidth * 0.9) : (clientWidth * 0.9);

      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className='sm:p-7 p-3 space-y-4'>
      <div className='flex items-center gap-2 group/title w-max cursor-pointer sm:pl-1.5'>
        <h3 className='sm:text-4xl text-3xl font-bold sm:mb-3 dark:text-white text-slate-900'>{name}</h3>
        <ChevronRightIcon className="size-6 transition-transform duration-300 group-hover/title:translate-x-2 text-gray-500 dark:text-gray-400 group-hover/title:text-slate-900 dark:group-hover/title:text-white" />
      </div>

      <div className="relative group/carousel sm:pl-1.5">

        <div
          className={`hidden lg:flex absolute left-0 top-0 bottom-0 w-24 sm:w-32 z-10 items-center justify-start pl-2 sm:pl-4 
            bg-gradient-to-r from-white/90 via-white/40 to-transparent 
            dark:from-black/90 dark:via-black/40 dark:to-transparent 
            transition-opacity duration-300 cursor-pointer ${isScrolledLeft
              ? 'opacity-0 pointer-events-none'
              : 'opacity-0 group-hover/carousel:opacity-100'
            }`}
          onClick={() => scroll('left')}
        >
          <ChevronLeftIcon className="text-slate-800 dark:text-white size-9 transition-transform duration-300" strokeWidth={2.5} />
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex items-center justify-start sm:gap-x-4 gap-x-3 overflow-x-auto scrollbar-hide py-4"
        >
          {
            movieList.map((movie) => (
              <div key={movie.id} className="flex-none transition-transform duration-300 hover:scale-105 hover:z-20 cursor-pointer">
                <Card
                  id={movie.id}
                  title={movie.title}
                  poster={movie.poster}
                  rating={movie.rating}
                  type={movie.type}
                />
              </div>
            ))
          }
        </div>

        <div
          className={`hidden lg:flex absolute right-0 top-0 bottom-0 w-24 sm:w-32 z-10 items-center justify-end pr-2 sm:pr-4 
            bg-gradient-to-l from-white/90 via-white/40 to-transparent 
            dark:from-black/90 dark:via-black/40 dark:to-transparent 
            transition-opacity duration-300 cursor-pointer ${isScrolledRight
              ? 'opacity-0 pointer-events-none'
              : 'opacity-0 group-hover/carousel:opacity-100'
            }`}
          onClick={() => scroll('right')}
        >
          <ChevronRightIcon className="text-slate-800 dark:text-white size-9 transition-transform duration-300" strokeWidth={2.5} />
        </div>

      </div>
    </div>
  );
}

export default React.memo(CardSection);