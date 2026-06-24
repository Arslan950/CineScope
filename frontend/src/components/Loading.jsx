import React from 'react'
import Lottie from 'lottie-react'
import animation from '../animation/loading.json'
const Loading = () => {
    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='max-w-70 mb-30'>
                <Lottie
                    animationData={animation}
                />
                <p className='text-center text-lg text-white/75 mt-3'>Loading...</p>
            </div>
        </div>
    )
}

export default Loading
