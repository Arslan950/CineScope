import { SearchIcon } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ className = "", classNameforIcon = "", classNameforButton = "" }) => {
    const [movieName, setMovieName] = useState("");
    const navigate = useNavigate()

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        navigate(`/explore/${encodeURIComponent(movieName.trim())}`);
    }, [movieName, navigate]);

    return (
        <form onSubmit={handleSearch} className='w-full mt-4 sm:p-0 px-2.5'>
            <div className='relative w-full max-w-lg mx-auto '>
                <div className={`absolute ${classNameforIcon} top-1/2 left-4 -translate-y-1/2 `}>
                    <SearchIcon className='h-5 w-6' opacity={0.7} />
                </div>
                <input
                    type="text"
                    placeholder='Search for movies'
                    value={movieName}
                    onChange={(e) => setMovieName(e.target.value)}
                    className={`w-full pl-12 pr-28 py-3 rounded-full 
                               bg-slate-100 dark:bg-[#1f2a38] 
                               text-slate-900 dark:text-white 
                               placeholder:text-slate-400 dark:placeholder:text-gray-400 
                               border border-slate-300 dark:border-white/70 
                               focus:ring-2 focus:ring-blue-500 focus:outline-none
                               duration-200 ${className} `}
                />
                <div className={`absolute ${classNameforButton} top-1/2 right-2 -translate-y-1/2 `}>
                    <button
                        type='submit'
                        className='bg-blue-500 text-white px-3 py-1.5 rounded-full 
                                   hover:bg-blue-600 duration-300 font-semibold'>
                        Search
                    </button>
                </div>
            </div>
        </form>
    )
}

export default SearchBar

