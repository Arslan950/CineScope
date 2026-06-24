import SearchBar from '../components/SearchBar';
import { SearchIcon } from 'lucide-react';

const Search = () => {
    return (
        <div className='max-w-7xl flex flex-col items-center p-4 sm:p-6 gap-y-20 mx-auto'>
            <div className='flex flex-col items-center gap-y-8'>
                <div className='flex flex-col items-center gap-y-3 text-center'>
                    <h1 className='sm:text-4xl text-3xl font-semibold mt-5 text-slate-900 dark:text-white'>
                        Discover Amazing Movies
                    </h1>
                    <p className='text-slate-600 dark:text-white/70 leading-relaxed sm:text-lg text-base md:text-nowrap'>
                        Search for your favorite movies, explore details, and save them to your favorites.
                    </p>
                </div>
                <SearchBar />
            </div>
            <div className='flex flex-col items-center gap-y-6'>
                <SearchIcon size={45} opacity={0.6} />
                <p className='text-slate-600 dark:text-white/75 text-lg'>
                    Search for your favorite movies!
                </p>
            </div>
        </div>
    );
};

export default Search;