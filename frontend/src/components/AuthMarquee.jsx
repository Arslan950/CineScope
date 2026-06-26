import React from 'react'
import { images } from "../MoviesDB/moviesList.js";
import { ThreeDMarquee } from './ui/3d-marquee.jsx';
const AuthMarquee = () => {
    return (
        <span className='h-full w-1/2 sm:block hidden' >
            <ThreeDMarquee images={images} className={"m-5 h-full"} />
        </span>
    )
}

export default AuthMarquee
