import React from 'react'

const TvDetailsSkeleton = () => {
  return (
    <section className="mt-16 min-h-screen">
      <section className="relative w-full h-[80dvh] bg-gray-700 skeleton shimmer-light">
        <div className="absolute bottom-6 left-0 w-full px-6 sm:bottom-10 sm:left-8 sm:p-4 sm:w-auto">
          <div className="max-w-3xl">
            <div className="h-10 sm:h-12 w-3/4 sm:w-96 bg-gray-900 skeleton shimmer-light rounded-lg" />

            <div className="mt-4 space-y-2">
              <div className="h-4 w-full bg-gray-900 skeleton shimmer-light rounded" />
              <div className="h-4 w-11/12 bg-gray-900 skeleton shimmer-light rounded" />
              <div className="h-4 w-2/3 bg-gray-900 skeleton shimmer-light rounded" />
            </div>

            <div className="flex items-center gap-4 pt-8 sm:justify-start justify-center">
              <div className="h-11 w-44 bg-gray-900 skeleton shimmer-light rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="sm:max-w-[75%] mx-auto p-4 mb-16 mt-10 grid xl:grid-cols-[auto_1fr] grid-cols-1 gap-8">
        <div className="sm:w-84 w-70 h-130 shrink-0 mx-auto xl:mx-0 bg-gray-700 skeleton shimmer-light" />

        <div className="w-full h-full xl:p-6 rounded-xl mx-auto xl:mx-0">

          <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-2 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-700 skeleton shimmer-light p-3 rounded-xl xl:w-50 w-full sm:h-22 h-25 flex flex-col gap-y-2.5"
              >
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-y-3 mt-7">
            <div className='bg-gray-700 skeleton shimmer-light h-5 w-24 rounded mb-2' />
            <div className="flex items-center flex-wrap gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className='bg-gray-700 skeleton shimmer-light py-2 px-3 w-28 h-10 rounded-full border border-gray-600/50'
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-y-3 mt-2">
            <div className='bg-gray-700 skeleton shimmer-light h-8 w-50 rounded mb-4 mt-8' />
            <div className="flex items-center gap-x-8 sm:w-[600px] w-[320px]">
              <div className='bg-gray-700 skeleton shimmer-light w-40 h-20 rounded-xl' />
              <div className='bg-gray-700 skeleton shimmer-light w-48 h-8 rounded' />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 border-t border-slate-800">
        <div className="h-7 w-40 bg-gray-700 skeleton shimmer-light rounded mb-8" />
        <div className="flex overflow-x-auto gap-6 pb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-[160px] w-[160px] flex flex-col rounded-xl overflow-hidden border border-slate-700/50">
              <div className="w-full h-52 bg-gray-700 skeleton shimmer-light" />
              <div className="p-4 flex-1 flex flex-col justify-center gap-2">
                <div className="h-3 w-full bg-gray-700 skeleton shimmer-light rounded" />
                <div className="h-3 w-2/3 bg-gray-700 skeleton shimmer-light rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 border-t border-slate-800">
        <div className="h-7 w-32 bg-gray-700 skeleton shimmer-light rounded mb-8" />
        <div className="flex overflow-x-auto gap-6 pb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="min-w-[200px] w-[200px] sm:min-w-[220px] sm:w-[220px] flex flex-col rounded-xl overflow-hidden border border-slate-700/50">
              <div className="w-full h-72 sm:h-80 bg-gray-700 skeleton shimmer-light" />
              <div className="p-4 flex-1 flex flex-col justify-center gap-2">
                <div className="h-4 w-full bg-gray-700 skeleton shimmer-light rounded" />
                <div className="h-3 w-1/2 bg-gray-700 skeleton shimmer-light rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 border-t border-slate-800">
        <div className="h-7 w-36 bg-gray-700 skeleton shimmer-light rounded mb-8" />
        <div className="flex overflow-x-auto gap-6 pb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="min-w-[160px] w-[160px] flex flex-col rounded-xl overflow-hidden border border-slate-700/50">
              <div className="w-full h-52 bg-gray-700 skeleton shimmer-light" />
              <div className="p-4 flex-1 flex flex-col justify-center gap-2">
                <div className="h-3 w-full bg-gray-700 skeleton shimmer-light rounded" />
                <div className="h-3 w-2/3 bg-gray-700 skeleton shimmer-light rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 mb-16 border-t border-slate-800">
        <div className="h-7 w-32 bg-gray-700 skeleton shimmer-light rounded mb-8" />
        <div className="w-full max-w-5xl mx-auto aspect-video rounded-2xl bg-gray-700 skeleton shimmer-light" />
      </div>
    </section>
  )
}

export default React.memo(TvDetailsSkeleton);