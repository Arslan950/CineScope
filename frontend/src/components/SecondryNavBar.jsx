import React from 'react'
import { useState } from 'react'
import logo from '../assets/logo.svg'
import { motion } from 'motion/react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import ThemeBtn from './ThemeBtn.jsx'
import { useThemeStore } from '../store/ThemeStore.js'
import { useAuthStore } from "../store/AuthStore.js"
import { LogOutIcon, UserCircle } from "lucide-react"

const SecondryNavBar = () => {
    const [dropdownFlag, setDropdownFlag] = useState(false)
    const navigate = useNavigate();
    const theme = useThemeStore((state) => state.theme);
    const { loggedOut } = useAuthStore();

    const handleLogout = () => {
        loggedOut();
        navigate('/login')
    }

    return (
        <header>
            <nav 
            className='bg-slate-100 dark:bg-[#111826] text-slate-900 dark:text-white px-4 py-4 w-full shadow-md shadow-slate-200 dark:shadow-black/20 sm:duration-300 flex justify-between items-center'>
                <div className='sm:ml-20'>
                    <Link to="/" className='flex items-center gap-x-3'>
                        <img src={logo} alt="CineScope"/>
                        <h1 className='sm:text-xl font-semibold text-lg'>CineScope</h1>
                    </Link>
                </div>
                <div className='sm:mr-20'>
                    <ThemeBtn />
                </div>
            </nav>
        </header >
    )
}

export default SecondryNavBar