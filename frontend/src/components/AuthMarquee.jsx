import React from 'react'
import { images } from "../MoviesDB/moviesList.js";
import { ThreeDMarquee } from './ui/3d-marquee.jsx';
const AuthMarquee = () => {
    return (
        <ThreeDMarquee images={images} className={"rounded-none h-full"}/>
    )
}

export default AuthMarquee
