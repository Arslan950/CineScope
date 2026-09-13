import React, { useState } from 'react';
import logo from '../assets/logo.svg';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Moon, Sun, LogOut, Menu, X, ChevronRight, Home, Heart } from 'lucide-react';
import { useAccount } from '../hooks/useAccount.js';
import AccountMenu from './AccountMenu';
import SearchBar from './SearchBar';

const ICON_BUTTON = 'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5fa2fa] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-offset-[#111826] border-slate-300 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white';

const navLinks = [
  { id: 'home', label: 'Home', path: '/home', icon: Home },
  { id: 'favourites', label: 'Favorites', path: '/favorites', icon: Heart },
];

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const location = useLocation();
  const profileActive = location.pathname === '/profile';

  const { theme, avatar, userName, onToggleTheme, handleLogout } = useAccount();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-[#090d14]">
      <div className="flex h-16 w-full items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:h-[68px] lg:gap-6 lg:px-8">

        <Link to="/" onClick={() => setMenuOpen(false)} className="flex shrink-0 items-center gap-2 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5fa2fa]">
          <span className="flex h-10 w-10 items-center justify-center">
            <img src={logo} alt="CineScope" />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight text-slate-900 dark:text-white sm:text-xl">
            CineScope
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:ml-3 md:block lg:ml-8">
          <ul className="flex items-center gap-1">
            {navLinks.map(({ id, label, path, icon: Icon }) => (
              <li key={id}>
                <NavLink
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) => `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5fa2fa] lg:px-3.5 ${isActive ? 'text-[#2b7ae4] dark:text-[#5fa2fa]' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  <span className="hidden lg:inline">{label}</span>
                  <span className="sr-only lg:hidden">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <SearchBar
          containerClass="ml-auto hidden min-w-0 flex-1 md:block md:max-w-sm lg:max-w-xl"
          inputClass="h-10"
          buttonClass="h-7"
          id="navbar-search"
        />
        <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
          <button type="button" onClick={() => setMobileSearchOpen((open) => !open)} className={`${ICON_BUTTON} md:hidden`}>
            {mobileSearchOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Search className="h-5 w-5" aria-hidden="true" />}
          </button>


          <div className="hidden md:block">
            <AccountMenu />
          </div>

          <button type="button" onClick={() => setMenuOpen((open) => !open)} className={`${ICON_BUTTON} md:hidden`}>
            {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {mobileSearchOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-200 md:hidden dark:border-white/10">
            <SearchBar
              containerClass="px-4 py-3 sm:px-6"
              inputClass="h-11"
              buttonClass="h-8"
              id="navbar-search-mobile"
              autoFocus
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-200 bg-slate-100 md:hidden dark:border-white/10 dark:bg-[#111826]">
            <nav aria-label="Mobile" className="px-4 pb-4 pt-3 sm:px-6">
              <Link to="/profile" onClick={() => setMenuOpen(false)} className={`mb-2 flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5fa2fa] ${profileActive ? 'border-[#5fa2fa] bg-[#5fa2fa]/10' : 'border-slate-300 hover:bg-slate-200 dark:border-white/10 dark:hover:bg-white/10'}`}>
                <img src={avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">{userName}</span>
                  <span className="block truncate text-xs text-slate-500 dark:text-slate-400">View profile</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
              </Link>
              <ul className="flex flex-col gap-1">
                {navLinks.map(({ id, label, path, icon: Icon }) => (
                  <li key={id}>
                    <NavLink to={path} end={path === '/'} onClick={() => setMenuOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5fa2fa] ${isActive ? 'text-[#2b7ae4] dark:text-[#5fa2fa]' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                role="switch"
                aria-checked={theme === 'dark'}
                onClick={onToggleTheme}
                className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5fa2fa] text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <span className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Sun className="h-5 w-5" aria-hidden="true" />
                  )}
                  <span className="capitalize">{theme}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${theme === 'dark' ? 'bg-[#5fa2fa]/40' : 'bg-slate-300'
                    }`}
                >
                  <span
                    className={`absolute top-[3px] h-[14px] w-[14px] rounded-full transition-all bg-[#5fa2fa] ${theme === 'dark' ? 'left-[19px]' : 'left-[3px]'
                      }`}
                  />
                </span>
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); handleLogout(); }} className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#5fa2fa] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#4b91ee] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5fa2fa]">
                <LogOut className="h-[18px] w-[18px]" aria-hidden="true" /> Logout
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default React.memo(NavBar);