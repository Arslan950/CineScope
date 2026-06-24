import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className='max-w-6xl flex flex-col items-center m-6 gap-y-13 mt-36'>
            <h1 className='sm:text-5xl text-2xl font-semibold '>Page not found error 404</h1>
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={()  => navigate('/home')}
                className='bg-[#5fa2fa] text-white font-semibold sm:text-lg sm:p-3 p-1.5 rounded-xl '         
            >
                Go back to Home
            </motion.button>
        </div>
    )
}

export default NotFound
