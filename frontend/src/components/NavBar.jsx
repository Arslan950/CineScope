import React from 'react'
import { useState } from 'react'
import logo from '../assets/logo.svg'
import { motion } from 'motion/react'
import { NavLink, Link } from 'react-router-dom'
import ThemeBtn from './ThemeBtn'
import { useThemeStore } from '../store/ThemeStore'

const NavBar = () => {
    const [dropdownFlag, setDropdownFlag] = useState(false)

    const theme = useThemeStore((state) => state.theme);

    return (
        <header>
            <nav className='bg-slate-100 dark:bg-[#111826] text-slate-900 dark:text-white px-4 py-4 flex items-center w-full shadow-md shadow-slate-200 dark:shadow-black/20 sm:duration-300'>

                <div className='flex-1'>
                    <Link to="/" className='flex items-center gap-x-3'>
                        <img src={logo} alt="CineScope" className='sm:w-fit w-8' />
                        <h1 className='sm:text-xl font-semibold text-lg'>CineScope</h1>
                    </Link>
                </div>

                {/* {mobile NavBar} */}
                <div className='flex-1 flex justify-end sm:hidden relative'>
                    <label
                        className="btn btn-circle swap swap-rotate dark:bg-[#111826] bg-slate-100  border-none shadow-none"
                    >
                        <input type="checkbox"
                            onChange={() => {
                                setTimeout(() => {
                                    setDropdownFlag(!dropdownFlag)
                                }, 120);
                            }}
                            value={!dropdownFlag}
                        />

                        {/* hamburger icon */}
                        <svg
                            className="swap-off fill-black dark:fill-white"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 512 512">
                            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                        </svg>

                        {/* close icon */}
                        <svg
                            className="swap-on fill-black dark:fill-white"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 512 512">
                            <polygon
                                points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                        </svg>
                    </label>
                    {
                        dropdownFlag && (
                            <motion.div
                                initial={{ opacity: 0.6, y: -0, x: 10 }}
                                whileInView={{ opacity: 1, x: -5 }}
                                transition={{
                                    delay: 0.1,
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}
                                className="absolute right-0 top-8 mt-4 m-3 w-40 bg-white dark:bg-[#212938] text-slate-900 dark:text-white rounded-md shadow-lg z-50 ">
                                <ul className="flex flex-col ">
                                    <li className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-neutral-700 cursor-pointer ">
                                        <NavLink
                                            to="/home"
                                            className={({ isActive }) =>
                                                `flex items-center gap-x-3 group ${isActive ? "text-[#5fa2fa]" : "text-slate-800 dark:text-white"}`
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <svg
                                                        className='group-hover:stroke-[#5fa2fa] duration-200'
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke={isActive ? "#5fa2fa" : "currentColor"}
                                                        height="24"
                                                        width="24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                                        />
                                                    </svg>

                                                    <p className='text-[1em] group-hover:text-[#5fa2fa] duration-200'>Home</p>
                                                </>
                                            )}
                                        </NavLink>
                                    </li>
                                    <li className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-neutral-700 cursor-pointer">
                                        <NavLink
                                            to="/favorites"
                                            className={({ isActive }) =>
                                                `flex items-center gap-x-3 group ${isActive ? "text-[#5fa2fa]" : "text-slate-800 dark:text-white"}`
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <svg
                                                        className="group-hover:stroke-[#5fa2fa] duration-200"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke={isActive ? "#5fa2fa" : "currentColor"}
                                                        height="24"
                                                        width="24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                                        />
                                                    </svg>

                                                    <p className="text-[1em] group-hover:text-[#5fa2fa] duration-200">Favorites</p>
                                                </>
                                            )}
                                        </NavLink>
                                    </li>
                                    <li className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-neutral-700 cursor-pointer">
                                        <NavLink
                                            to="/search"
                                            className={({ isActive }) =>
                                                `flex items-center gap-x-3 group ${isActive ? "text-[#5fa2fa]" : "text-slate-800 dark:text-white"}`
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none" viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke={isActive ? "#5fa2fa" : "currentColor"}
                                                        height="24"
                                                        width="24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                                        />
                                                    </svg>
                                                    <p className="text-[1em] group-hover:text-[#5fa2fa] duration-200">Search</p>
                                                </>
                                            )}
                                        </NavLink>
                                    </li>

                                    <li className="px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-neutral-700 cursor-pointer ">
                                        <div className='flex items-center ml-[7px]'>
                                            <ThemeBtn />
                                            <p>{theme}</p>
                                        </div>

                                    </li>
                                </ul>
                            </motion.div>
                        )
                    }
                </div>





                {/* {Dekstop NavBar} */}
                <div className='sm:flex-1 sm:flex sm:justify-center sm:gap-x-6 hidden'>
                    <NavLink
                        to="/home"
                        className={({ isActive }) =>
                            `flex items-center gap-x-1 group ${isActive ? "text-[#5fa2fa]" : "text-slate-800 dark:text-white"}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <svg
                                    className='group-hover:stroke-[#5fa2fa] duration-200'
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke={isActive ? "#5fa2fa" : "currentColor"}
                                    height="24"
                                    width="24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                    />
                                </svg>

                                <p className='text-[1em] group-hover:text-[#5fa2fa] duration-200'>Home</p>
                            </>
                        )}
                    </NavLink>
                    <NavLink
                        to="/favorites"
                        className={({ isActive }) =>
                            `flex items-center gap-x-1 group ${isActive ? "text-[#5fa2fa]" : "text-slate-800 dark:text-white"}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <svg
                                    className="group-hover:stroke-[#5fa2fa] duration-200"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke={isActive ? "#5fa2fa" : "currentColor"}
                                    height="24"
                                    width="24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                    />
                                </svg>

                                <p className="text-[1em] group-hover:text-[#5fa2fa] duration-200">Favorites</p>
                            </>
                        )}
                    </NavLink>
                    <NavLink
                        to="/search"
                        className={({ isActive }) =>
                            `flex items-center gap-x-1 group ${isActive ? "text-[#5fa2fa]" : "text-slate-800 dark:text-white"}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <svg
                                    className="group-hover:stroke-[#5fa2fa] duration-200"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke={isActive ? "#5fa2fa" : "currentColor"}
                                    height="24"
                                    width="24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                    />
                                </svg>

                                <p className="text-[1em] group-hover:text-[#5fa2fa] duration-200">Search</p>
                            </>
                        )}
                    </NavLink>

                </div>

                <div className='sm:flex-1 sm:flex sm:justify-end hidden '>
                    <ThemeBtn />
                </div>
            </nav>
        </header >
    )
}

export default NavBar