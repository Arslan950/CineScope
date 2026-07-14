import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import axios from "axios";
import axiosRetry from "axios-retry"
import https from "https";

const agent = new https.Agent({ keepAlive: true, timeout: 60000 });

axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        return (
            axiosRetry.isNetworkOrIdempotentRequestError(error) ||
            error.code === "ECONNRESET" ||
            error.code === "ECONNABORTED"
        )
    },
})

const getTrendingData = asyncHandler(async (req, res) => {
    const API_KEY = process.env.TMDB_API_KEY;

    const urls = {
        hollywood: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&with_origin_country=US&with_original_language=en`,
        bollywood: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&with_origin_country=IN&with_original_language=hi`,
        webSeries: `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&with_original_language=en`
    }

    const formatItem = (item) => {
        return {
            id: item.id,
            title: item.title || item.name || item.original_name,
            poster: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : null,
            rating: `${item.vote_average.toFixed(1)}/10`
        }
    };

    try {
        const [hollywoodRes, bollywoodRes, webSeriesRes] = await Promise.all([
            axios.get(urls.hollywood, { httpsAgent: agent, timeout: 10000 }),
            axios.get(urls.bollywood, { httpsAgent: agent, timeout: 10000 }),
            axios.get(urls.webSeries, { httpsAgent: agent, timeout: 10000 })
        ]);

        const finalData = {
            hollywood: hollywoodRes.data?.results?.slice(0, 5).map(formatItem) || [],
            bollywood: bollywoodRes.data?.results?.slice(0, 5).map(formatItem) || [],
            webSeries: webSeriesRes.data?.results?.slice(0, 5).map(formatItem) || []
        };

        if (finalData.hollywood.length === 0 && finalData.bollywood.length === 0) {
            throw new ApiError(404, "No trending data found from TMDB");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, finalData, "Trendng Data fetched succesfully"))

    } catch (error) {
        throw new ApiError(400, `${error.message}`)
    }
});

export {
    getTrendingData
}