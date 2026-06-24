import React from 'react'

const MoviesDetailsSkeleton = () => {
  return (
    <div class="bg-slate-100 dark:bg-gray-900 text-white font-sans p-6 sm:p-8 lg:p-12 mt-10 animate-pulse">
      <div class="max-w-6xl mx-auto">

        <div class="h-12 bg-gray-700 rounded-3xl w-full md:w-lg mx-auto mb-12"></div>

        <div class="flex flex-col md:flex-row gap-8 lg:gap-12">

          <div class="flex-shrink-0 w-full md:w-1/3">
            <div class="w-full bg-gray-700 rounded-xl aspect-[2/3]"></div>
          </div>

          <div class="flex-1 flex flex-col">
            <div class="h-10 bg-gray-700 rounded-md w-3/4 sm:text-left text-center mb-4"></div>

            <div class="flex items-center mb-6 sm:justify-start justify-center">
              <div class="h-4 bg-gray-700 rounded-md w-20"></div>
              <div class="h-4 bg-gray-700 rounded-md w-16 ml-4"></div>
            </div>

            <div class="space-y-3 mb-8">
              <div class="h-4 bg-gray-700 rounded-md w-full"></div>
              <div class="h-4 bg-gray-700 rounded-md w-full"></div>
              <div class="h-4 bg-gray-700 rounded-md w-5/6"></div>
            </div>

            <div class="space-y-4">
              <div class="h-4 bg-gray-700 rounded-md w-1/2"></div>
              <div class="h-4 bg-gray-700 rounded-md w-2/3"></div>
              <div class="h-4 bg-gray-700 rounded-md w-1/2"></div>
              <div class="h-4 bg-gray-700 rounded-md w-3/4"></div>
              <div class="h-4 bg-gray-700 rounded-md w-1/2"></div>
            </div>

            <div class="flex items-center gap-4 pt-8 sm:justify-start justify-center">
              <div class="h-12 bg-gray-700 rounded-lg w-48"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoviesDetailsSkeleton
