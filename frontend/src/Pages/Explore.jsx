import React, { useState, useEffect } from 'react';
import Loading from "../components/Loading.jsx"
import Card from "../components/Cards/Card.jsx";
import api from "../lib/axiosInstance.js"
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Explore = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const searchedTerm = searchParams.get("search");
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [results, setResults] = useState([]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        const controller = new AbortController();

        const getSearchResults = async () => {
            setLoading(true);
            try {
                const response = await api.post("/explore/search-results", {
                    "searchedTerm": searchedTerm,
                    "page": page
                }, { signal: controller.signal });

                setResults(response.data?.data?.results);
                setMaxPage(response.data?.data?.total_pages);
            } catch (error) {
                if (error.name === "CanceledError" || error.code === "ERR_CANCELED") return;
                if (error.response) {
                    const backendMessage = error.response?.data?.message || "Something went wrong";
                    setErrorMessage(backendMessage);
                    toast.error(backendMessage);
                } else if (error.request) {
                    const networkMsg = "Network error. Please check your connection.";
                    setErrorMessage(networkMsg);
                    toast.error(networkMsg);
                } else {
                    const unexpectedMsg = "An unexpected error occurred.";
                    setErrorMessage(unexpectedMsg);
                    toast.error(unexpectedMsg);
                }
            } finally {
                setLoading(false);
            }
        };

        getSearchResults();

        return () => controller.abort();
    }, [page, searchedTerm]);

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

            {loading && (
                <div className='flex justify-center py-16'>
                    <Loading className={"h-fit"} />
                </div>
            )}

            {!loading && errorMessage && (
                <div className='w-full max-w-md text-center py-16'>
                    <p className='text-red-400 text-sm sm:text-base'>{errorMessage}</p>
                </div>
            )}

            {!loading && !errorMessage && results.length === 0 && (
                <div className='w-full max-w-md text-center py-16'>
                    <p className='text-gray-400 text-sm sm:text-base'>
                        No results found{searchedTerm ? ` for "${searchedTerm}"` : ""}.
                    </p>
                </div>
            )}

            {!loading && !errorMessage && results.length > 0 && (
                <div className='w-full max-w-8xl'>
                    <section className='grid grid-cols-2 gap-3 xs:gap-4 sm:gap-5 grid-col-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5'>
                        {results.map((movie) => (
                            <Card
                                visiblity={1}
                                key={movie.id}
                                id={movie.id}
                                title={movie.title}
                                poster={movie.poster}
                                rating={movie.rating}
                            />
                        ))}
                    </section>
                </div>
            )}

            {!loading && !errorMessage && results.length > 0 && (
                <div className="join mt-10 flex-wrap justify-center">
                    {Array.from({ length: maxPage }, (_, i) => i + 1).map((num) => (
                        <input
                            key={num}
                            className="join-item btn btn-square btn-sm sm:btn-md"
                            type="radio"
                            name="options"
                            aria-label={String(num)}
                            checked={page === num}
                            onChange={() => handlePageChange(num)}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

export default Explore;