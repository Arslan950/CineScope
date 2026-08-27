import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading.jsx";
import Card from "../components/Cards/Card.jsx";
import api from "../lib/axiosInstance.js";
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const getPaginationRange = (currentPage, totalPages) => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
        return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
        return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

const Explore = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchedTerm = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;

    const handlePageChange = (newPage) => {
        setSearchParams(prevParams => {
            prevParams.set('page', Number(newPage));
            return prevParams;
        })
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["searchResults", searchedTerm, page],
        queryFn: async ({ signal }) => {
            const response = await api.post("/explore/search-results", {
                "searchedTerm": searchedTerm,
                "page": page
            }, { signal });

            return response.data?.data;
        },
        staleTime: 3 * 60 * 1000
    });

    const results = data?.results || [];
    const maxPage = data?.total_pages || 0;

    useEffect(() => {
        if (isError && error) {
            if (error.name === "CanceledError" || error.code === "ERR_CANCELED") return;
            if (error.response) {
                const backendMessage = error.response?.data?.message || "Something went wrong";
                toast.error(backendMessage);
            } else if (error.request) {
                const networkMsg = "Network error. Please check your connection.";
                toast.error(networkMsg);
            } else {
                const unexpectedMsg = "An unexpected error occurred.";
                toast.error(unexpectedMsg);
            }
        }
    }, [error, isError]);

    return (
        <section className='min-h-screen w-full flex flex-col items-center px-4 pt-20 pb-10 sm:px-6 md:px-8'>
            <div className='w-full max-w-8xl text-center mb-6 sm:mb-10'>
                <p className='text-xs sm:text-sm uppercase tracking-widest text-gray-400 mb-1'>
                    Search results
                </p>
                <h1 className='font-semibold text-xl sm:text-2xl md:text-3xl break-words'>
                    {searchedTerm ? `"${searchedTerm}"` : "Explore"}
                </h1>
            </div>

            {isLoading && (
                <div className='flex justify-center py-16 w-full'>
                    <Loading className={"h-fit"} />
                </div>
            )}

            {!isLoading && isError && results.length === 0 && (
                <div className='w-full max-w-md text-center py-16'>
                    <p className='text-gray-400 text-sm sm:text-base'>
                        No results found{searchedTerm ? ` for "${searchedTerm}"` : ""}.
                    </p>
                </div>
            )}

            {!isLoading && !isError && results.length > 0 && (
                <div className='w-full mx-auto'>
                    <section className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 sm:gap-x-6 md:gap-x-8 lg:gap-x-10 xl:gap-x-12 gap-y-10 justify-items-center'>
                        {results.map((movie) => (
                            <Card
                                key={movie.id}
                                id={movie.id}
                                title={movie.title}
                                poster={movie.poster}
                                rating={movie.rating}
                                type={movie.type}
                            />
                        ))}
                    </section>
                </div>
            )}

            {!isLoading && !isError && maxPage > 0 && (
                <div className="join mt-10 flex-wrap justify-center">
                    {getPaginationRange(page, maxPage).map((item, index) => {
                        if (item === '...') {
                            return (
                                <button key={`ellipsis-${index}`} disabled className="join-item btn btn-square btn-sm sm:btn-md  border-none text-gray-500">
                                    ...
                                </button>
                            );
                        }

                        return (
                            <input
                                key={item}
                                className="join-item btn btn-square btn-sm sm:btn-md checked:bg-[#5fa2fa] checked:border-blue-500 checked:text-white hover:checked:bg-blue-600 bg-transparent"
                                type="radio"
                                name="options"
                                aria-label={String(item)}
                                checked={page === item}
                                onChange={() => handlePageChange(item)}
                            />
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default Explore;