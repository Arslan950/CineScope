import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
const apiKey = import.meta.env.VITE_OMDB_API_KEY;

function useFetchDetails(title) {
    const [movieData, setmovieData] = useState({});
    const [loading, setloading] = useState(true);
    useEffect(() => {
        setloading(true);
        const getData = async () => {
            try {
                const response = await axios.get(`https://www.omdbapi.com/?t=${title}&apikey=${apiKey}`);
                setmovieData(response.data);
            } catch (error) {
                console.log("error fetching data ", error);
            } finally {
                setloading(false);
            }
        };
        getData();
    }, [title, apiKey]);

    return {
        movieData : movieData ,
        loading : loading 
    }
}

export default useFetchDetails ;