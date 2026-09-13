import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SEARCH_INPUT = 'w-full rounded-xl border border-slate-300 bg-white pl-9 pr-[84px] text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5fa2fa] focus:outline-none focus:ring-2 focus:ring-[#5fa2fa]/40 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 duration-200';

const SEARCH_SUBMIT = 'absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center rounded-lg bg-blue-500 px-3 text-xs font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5fa2fa] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#111826] duration-200';

const SearchBar = ({ 
  containerClass = '', 
  inputClass = 'h-10', 
  buttonClass = 'h-7',
  id = 'navbar-search',
  autoFocus = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        const params = new URLSearchParams({ search: searchQuery.trim(), page: 1 });
        navigate(`/explore/?${params.toString()}`);
    }
  };

  return (
    <form role="search" onSubmit={handleSearch} className={containerClass}>
      <label htmlFor={id} className="sr-only">Search movies and shows</label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" aria-hidden="true" />
        <input
          autoFocus={autoFocus}
          id={id}
          type="text"
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search movies, shows..."
          className={`${inputClass} ${SEARCH_INPUT}`}
        />
        <button type="submit" className={`${buttonClass} ${SEARCH_SUBMIT}`}>Search</button>
      </div>
    </form>
  );
}

export default React.memo(SearchBar);