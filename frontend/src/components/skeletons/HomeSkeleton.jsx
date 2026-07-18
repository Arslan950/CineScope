import React from 'react'

const HomeSkeleton = () => {
  return (
    <section className='w-full p-2 space-y-10 sm:p-7 mt-17'>
      <div className='relative w-full h-[60vh] bg-gray-700 skeleton shimmer-light rounded-3xl'></div>

      <div className='space-y-6 sm:mx-6'>
        <div className='h-10 sm:h-15 sm:w-75 w-45 space-y-4 bg-gray-700 skeleton shimmer-light rounded-lg'></div>
        <div className='sm:h-80 h-50 bg-gray-700 skeleton shimmer-light rounded-3xl'></div>
        <div className='h-10 sm:h-15 sm:w-75 w-45 space-y-4 bg-gray-700 skeleton shimmer-light rounded-lg'></div>
        <div className='sm:h-80 h-50 bg-gray-700 skeleton  shimmer-light rounded-3xl'></div>
        <div className='h-10 sm:h-15 sm:w-75 w-45 space-y-4 bg-gray-700 skeleton shimmer-light rounded-lg'></div>
        <div className='sm:h-80 h-50 bg-gray-700 skeleton  shimmer-light rounded-3xl'></div>
      </div>
    </section>
  )
}

export default HomeSkeleton
