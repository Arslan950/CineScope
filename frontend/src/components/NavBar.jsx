import React, { useState } from 'react'
import logo from '../assets/logo.svg'
import { motion } from 'motion/react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import ThemeBtn from './ThemeBtn.jsx'
import { useThemeStore } from '../store/ThemeStore.js'
import { useAuthStore } from "../store/AuthStore.js"
import { LogOutIcon, SearchIcon, HomeIcon, HeartIcon } from "lucide-react";
import SearchBar from "../components/SearchBar.jsx";
import fallBack from "../assets/fallBack.png"

const NavBar = () => {
    const [dropdownFlag, setDropdownFlag] = useState(false)
    const navigate = useNavigate();
    const theme = useThemeStore((state) => state.theme);
    const { loggedOut } = useAuthStore();

    const user = useAuthStore((state) => state.user);
    const avatar = user?.avatar || "https://res.cloudinary.com/dadnb58fk/image/upload/v1783945175/sk4bfdfewzwc57pfodgu.png" || fallBack;

    const handleLogout = () => {
        loggedOut().then(() => {
            navigate('/login');
        })
    }

    const navLinks = [
        { name: 'Home', path: '/home', icon: <HomeIcon size={23} /> },
        { name: 'Favorites', path: '/favorites', icon: <HeartIcon size={23} /> },
        { name: 'Search', path: '/search', icon: <SearchIcon size={23} /> }
    ];

    return (
        <header className="fixed z-10 top-0 left-0 w-full bg-white dark:bg-[#111826] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <nav className='w-full px-4 xl:px-8 py-2.5 flex items-center min-h-[64px]'>
                <div className='flex xl:hidden w-full justify-between items-center relative z-20'>
                    <Link to="/" className='flex items-center gap-x-2 w-fit'>
                        <img src={logo} alt="CineScope" className='w-8' />
                        <h1 className='text-lg font-bold text-slate-900 dark:text-white'>CineScope</h1>
                    </Link>

                    <label className="btn btn-circle swap swap-rotate dark:bg-[#111826] bg-white border-none shadow-none">
                        <input type="checkbox"
                            onChange={() => {
                                setTimeout(() => setDropdownFlag(!dropdownFlag), 120);
                            }}
                            checked={dropdownFlag}
                        />
                        <svg className="swap-off fill-black dark:fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" /></svg>
                        <svg className="swap-on fill-black dark:fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" /></svg>
                    </label>
                    
                    {dropdownFlag && (
                        <motion.div
                            initial={{ opacity: 0.6, y: -0, x: 10 }}
                            whileInView={{ opacity: 1, x: -5 }}
                            transition={{ delay: 0.1, duration: 0.3, ease: "easeInOut" }}
                            className="absolute right-0 top-10 mt-4 m-3 w-40 bg-white dark:bg-[#212938] text-slate-900 dark:text-white rounded-md shadow-lg border border-slate-100 dark:border-slate-700 z-50 overflow-hidden"
                        >
                            <ul className="flex flex-col">
                                {avatar && (
                                    <li className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                                        <Link to="/profile" className="flex items-center gap-x-3">
                                            <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-slate-300" />
                                            <span className="text-sm font-medium">Profile</span>
                                        </Link>
                                    </li>
                                )}
                                {navLinks.map((link) => (
                                    <li key={link.name} className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-neutral-700 cursor-pointer">
                                        <NavLink
                                            to={link.path}
                                            className={({ isActive }) => `flex items-center gap-x-3 group ${isActive ? "text-blue-500" : "text-slate-800 dark:text-white"}`}
                                        >
                                            {link.icon}
                                            <p className='text-[1em] duration-200'>{link.name}</p>
                                        </NavLink>
                                    </li>
                                ))}
                                <li className="px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-neutral-700 cursor-pointer">
                                    <div className='flex items-center ml-[7px]'>
                                        <ThemeBtn />
                                        <p>{theme}</p>
                                    </div>
                                </li>
                                <li className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-neutral-700 cursor-pointer" onClick={handleLogout}>
                                    <span className="flex items-center gap-x-3 text-red-500 ml-1">
                                        <LogOutIcon size={24} />
                                        <p className='text-[1em]'>Logout</p>
                                    </span>
                                </li>
                            </ul>
                        </motion.div>
                    )}
                </div>

                <div className='hidden xl:flex flex-1 items-center justify-between w-full'>
                    
                    <div className='flex items-center gap-x-20'>
                        <Link to="/" className='flex items-center gap-x-2 w-fit shrink-0'>
                            <img src={logo} alt="CineScope" className='w-8' />
                            <h1 className='text-xl font-bold tracking-tight text-slate-900 dark:text-white'>CineScope</h1>
                        </Link>

                        <div className='flex items-center gap-x-8'>
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-x-2 text-sm font-semibold transition-colors duration-200 whitespace-nowrap ${
                                            isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-blue-500'
                                        }`
                                    }
                                >
                                    {link.icon}
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1"></div>

                    <div className='flex items-center gap-x-5 pl-8'>
                        
                        <div className="w-[300px] xl:w-[450px] -mt-4">
                            <SearchBar
                                className="pl-11 pr-4 py-2 w-full rounded-md bg-white dark:bg-[#1f2a38] text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-blue-500 transition-all text-sm shadow-none"
                                classNameforIcon="text-slate-400 dark:text-slate-500"
                                classNameforButton="text-sm p-0.5 rounded-md" 
                            />
                        </div>

                        <div className="flex items-center gap-x-4 ml-2">
                            <ThemeBtn />
                            {avatar && (
                                <Link to="/profile" className="shrink-0">
                                    <img
                                        src={avatar}
                                        alt="Profile"
                                        className="w-9 h-9 rounded-full object-cover border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200 shadow-sm"
                                    />
                                </Link>
                            )}
                            
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLogout();
                                }}
                                className='flex items-center justify-center gap-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all duration-200 shadow-sm'
                            >
                                <span className="text-sm font-semibold whitespace-nowrap">Logout</span>
                                <LogOutIcon size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>

            </nav>
        </header>
    )
}

export default NavBar