import React from 'react'
import Lottie from 'lottie-react'
import animation from '../animation/loading.json'

const Loading = ({className}) => {
    return (
        <div className={`flex items-center justify-center ${className ? className : "min-h-screen"}`}>
            <div className='max-w-70 mb-30'>
                <Lottie
                    className="[&_path]:!fill-black/85 dark:[&_path]:!fill-white/85"
                    animationData={animation}
                />
                <p className='text-center text-lg dark:text-white/75 mt-3'>Loading...</p>
            </div>
        </div>
    )
}

export default Loading