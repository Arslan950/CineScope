import { useEffect, useState, useMemo } from 'react'
import api from "../lib/axiosInstance.js";
import Loading from "../components/Loading.jsx";
import Card from "../components/Cards/Card.jsx";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from '../store/AuthStore.js';
import { toast } from 'react-toastify';
import { Frown, HeartIcon } from 'lucide-react';

const ShareCollection = () => {
    const { shareToken } = useParams();
    const [filter, setFilter] = useState('All');
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const classNameForSVG = (!isLoggedIn) ? "hidden" : "block" ;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['shared-collection', shareToken],
        queryFn: async ({ signal }) => {
            const response = await api.get(`/favourites/get-shared-list/${shareToken}`, { signal });
            return response?.data?.data
        },
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (isError && error) {
            if (error.name === "CanceledError" || error.code === "ERR_CANCELED") return;

            if (error.response) {
                toast.error(error.response?.data?.message || "Server Error");
            } else if (error.request) {
                toast.error("Network error. Please check your connection.");
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
    }, [isError, error]);

    const favourites = Array.isArray(data?.favourites) ? data.favourites : [];

    const filteredList = useMemo(() => {
        return favourites.filter((media) => {
            if (filter === 'Movies') return media.type === 'movie';
            if (filter === 'Tv show') return media.type === 'tv';
            return true;
        });
    }, [favourites, filter]);

    if (isLoading) {
        return <Loading />
    }

    if (isError || !data) {
        return (
            <section className="flex min-h-[75vh] items-center justify-center px-4 py-12">
                <div className="max-w-3xl text-center">
                    <Frown size={62} className='mx-auto mb-8' />
                    <h1 className="sm:text-5xl text-3xl font-bold text-slate-900 dark:text-white">
                        Collection unavailable
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-white/70">
                        This shared collection may have expired or the link may be incorrect.
                    </p>
                </div>
            </section>
        )
    }

    const userDetails = data.userDetails || {};
    const fullName = userDetails.fullName || "CineScope User";
    const avatar = userDetails.avatar;

    return (
        <section className="mt-20 w-full px-4 sm:px-8 lg:px-12 mb-10">
            <div className='max-w-[1600px] mx-auto space-y-8'>
                <div className='border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-y-5 gap-x-4'>

                    <div className='flex items-center gap-x-4 sm:gap-x-6'>
                        <div className="relative shrink-0">
                            <img
                                src={avatar}
                                alt={fullName}
                                className='w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover shadow-sm ring-2 ring-slate-200 dark:ring-slate-700 bg-slate-100 dark:bg-slate-800'
                            />
                        </div>

                        <div className="flex flex-col justify-center">
                            <h1 className='text-xl sm:text-4xl font-bold text-slate-900 dark:text-white '>
                                {fullName}'s Collection
                            </h1>

                            <div className='flex items-center gap-x-2 mt-1.5 sm:mt-2.5'>
                                <span className='inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs sm:text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30'>
                                    {favourites.length} {favourites.length === 1 ? 'item' : 'items'}
                                </span>
                                <span className='text-sm sm:text-base text-slate-500 dark:text-white/60 font-medium'>
                                    saved
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center sm:self-center'>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white sm:px-4 sm:py-2.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer font-medium w-full sm:w-auto shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        >
                            <option value="All">All</option>
                            <option value="Movies">Movies</option>
                            <option value="Tv show">TV Shows</option>
                        </select>
                    </div>
                </div>

                {filteredList.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 sm:gap-x-6 md:gap-x-8 lg:gap-x-10 xl:gap-x-12 gap-y-10 justify-items-center">
                        {filteredList.map((media) => (
                            <Card
                                className={classNameForSVG}
                                allowed={isLoggedIn}
                                key={media.id}
                                id={media.id}
                                title={media.title}
                                poster={media.poster}
                                rating={media.rating}
                                type={media.type}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 px-6 text-center dark:border-slate-700">
                        <HeartIcon size={52} className="mb-4 text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">No favorites yet</h2>
                        <p className="mt-2 text-slate-600 dark:text-white/70">
                            This collection does not have any saved movies or shows.
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}

export default ShareCollection