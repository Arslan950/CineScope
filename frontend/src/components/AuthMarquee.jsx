import React from 'react'
import { images } from "../MoviesDB/moviesList.js";
import { ThreeDMarquee } from './ui/3d-marquee.jsx';
const AuthMarquee = () => {
    return (
        <ThreeDMarquee images={images} className={"h-full m-4"}/>
    )
}

export default AuthMarquee
