import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { client, isRedisConnected } from "../db/redis.js"
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
    const cache_key = "dashboard_data";
    if (isRedisConnected) {
        const cachedData = await client.get(cache_key);

        if (cachedData) {
            return res
                .status(200)
                .json(new ApiResponse(200, JSON.parse(cachedData), "data fetched from redis successfully"))
        }
    }

    const API_KEY = process.env.TMDB_API_KEY;

    const urls = {
        hollywood: `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`,
        bollywood: `https://api.themoviedb.org/3/discover/movie?with_original_language=hi&primary_release_date.gte=2026-01-01&primary_release_date.lte=2026-12-31&sort_by=popularity.desc&page=1&api_key=${API_KEY}&region=IN`,
        webSeries: `https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}`
    }

    const formatItem = (item, type, includeBackdrop = false) => {
        let dataTosend = {
            id: item.id,
            title: item.title || item.name || item.original_name,
            poster: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : `https://placehold.co/300x450/252525/FFFFFF?text=${item.title}`,
            rating: `${item.vote_average.toFixed(1)}/10`,
            type: type
        }

        if (includeBackdrop && item.backdrop_path) {
            dataTosend.backdrop = `https://image.tmdb.org/t/p/w1920${item.backdrop_path}`;
            dataTosend.overview = item.overview ;
        }

        return dataTosend;
    };

    try {
        const [hollywoodRes, bollywoodRes, webSeriesRes] = await Promise.all([
            axios.get(urls.hollywood, { httpsAgent: agent, timeout: 10000 }),
            axios.get(urls.bollywood, { httpsAgent: agent, timeout: 10000 }),
            axios.get(urls.webSeries, { httpsAgent: agent, timeout: 10000 })
        ]);

        const finalData = {
            hollywood: hollywoodRes.data?.results?.slice(0, 6).map((item, index) => formatItem(item, 'movie', index === 0)) || [],
            bollywood: bollywoodRes.data?.results?.slice(0, 5).map(item => formatItem(item, 'movie')) || [],
            webSeries: webSeriesRes.data?.results?.slice(0, 5).map(item => formatItem(item, 'tv')) || []
        };

        if (finalData.hollywood.length === 0 && finalData.bollywood.length === 0) {
            throw new ApiError(404, "No trending data found from TMDB");
        }

        if (isRedisConnected) {
            await client.setEx(cache_key, 43200, JSON.stringify(finalData))
        }

        return res
            .status(200)
            .json(new ApiResponse(200, finalData, "Trending Data fetched successfully"))

    } catch (error) {
        throw new ApiError(400, `${error.message}`)
    }
});

export {
    getTrendingData
}