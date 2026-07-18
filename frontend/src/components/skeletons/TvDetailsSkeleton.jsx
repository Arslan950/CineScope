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

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
        <div className="flex flex-col-reverse md:flex-row gap-12 items-start">
          <div className="flex-1 w-full space-y-10">
            <div>
              <div className="h-7 w-56 bg-gray-700 skeleton shimmer-light rounded mb-6" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="h-3 w-16 bg-gray-700 skeleton shimmer-light rounded" />
                    <div className="h-4 w-24 bg-gray-700 skeleton shimmer-light rounded" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="h-3 w-16 bg-gray-700 skeleton shimmer-light rounded mb-3" />
              <div className="flex gap-3 flex-wrap">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 w-20 bg-gray-700 skeleton shimmer-light rounded-full" />
                ))}
              </div>
            </div>

            <div>
              <div className="h-3 w-20 bg-gray-700 skeleton shimmer-light rounded mb-3" />
              <div className="flex items-center gap-4 bg-[#1e293b] p-4 rounded-xl w-fit border border-slate-700">
                <div className="h-10 w-10 bg-gray-700 skeleton shimmer-light rounded-lg" />
                <div className="h-4 w-32 bg-gray-700 skeleton shimmer-light rounded" />
              </div>
            </div>
          </div>

          <div className="w-full md:w-[300px] lg:w-[350px] flex justify-center md:justify-end shrink-0">
            <div className="w-64 h-96 sm:w-80 sm:h-[28rem] md:w-full md:h-[26rem] rounded-xl bg-gray-700 skeleton shimmer-light" />
          </div>
        </div>
      </div>

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

export default TvDetailsSkeleton
