import React from 'react';

const HomeSkeleton = () => {
  return (
    <section className='w-full mt-16'>
      <div className="relative w-full h-[80vh] min-h-[500px] bg-gray-800 skeleton shimmer-light">
        <div className="absolute inset-0 flex flex-col justify-end gap-y-4 px-6 pb-16 sm:px-12">
          <div className="h-5 w-32 bg-gray-700 rounded-md skeleton shimmer-light"></div>
          
          <div className="h-10 w-3/4 max-w-xl bg-gray-700 rounded-lg skeleton shimmer-light"></div>
          
          <div className="h-5 w-48 bg-gray-700 rounded-md skeleton shimmer-light"></div>
          
          <div className="space-y-2 max-w-xl mt-2">
            <div className="h-4 w-full bg-gray-700 rounded-md skeleton shimmer-light"></div>
            <div className="h-4 w-5/6 bg-gray-700 rounded-md skeleton shimmer-light"></div>
            <div className="h-4 w-4/6 bg-gray-700 rounded-md skeleton shimmer-light"></div>
          </div>
          
          <div className="h-12 w-32 bg-gray-700 rounded-lg mt-4 skeleton shimmer-light"></div>
        </div>
      </div>

      <div className='space-y-6 sm:p-7 p-2'>
        {[1, 2, 3].map((sectionIndex) => (
          <div key={sectionIndex} className='sm:p-7 p-3 space-y-4 overflow-hidden'>
            <div className='h-8 sm:h-10 w-48 sm:mb-3 bg-gray-700 rounded-lg skeleton shimmer-light'></div>
            <div className="flex items-center justify-evenly sm:gap-x-4 gap-x-6 overflow-x-scroll scrollbar-hide">
              {Array.from({ length: 5 }).map((_, cardIndex) => (
                <div key={cardIndex} className="w-40 shrink-0 sm:w-auto sm:shrink">
                  <div className="xl:w-65 xl:h-90 lg:w-58 lg:h-85 md:w-52 md:h-75 w-40 h-60 rounded-lg border border-gray-700 bg-gray-700 skeleton shimmer-light"></div>
                  <div className="h-5 w-3/4 bg-gray-700 rounded-md mt-3 skeleton shimmer-light ml-1"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default React.memo(HomeSkeleton);