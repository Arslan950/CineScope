import React from 'react'
import logo from '../assets/logo.svg'
import { Link } from 'react-router-dom'
import ThemeBtn from './ThemeBtn.jsx'

const SecondryNavBar = () => {
    return (
        <header className="fixed z-10 top-0 left-0 w-full bg-white dark:bg-[#090d14] shadow shadow-md duration-200">
            <nav className='w-full px-4 xl:px-8 py-2.5 flex items-center justify-between min-h-[64px]'>
                <div className='sm:ml-20'>
                    <Link to="/" className='flex items-center gap-x-3'>
                        <img src={logo} alt="CineScope" />
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

export default React.memo(SecondryNavBar);