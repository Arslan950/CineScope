import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import axios from "axios";
import axiosRetry from "axios-retry";
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

const formatData = (item) => {
    return {
        id: item.id,
        title: item.title || item.name || item.original_title || item.original_name,
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : "https://placehold.co/300x450/252525/FFFFFF?text=No+poster+availabe",
        rating: item.vote_average ? `${item.vote_average.toFixed(1)}/10` : item.vote_average
    }
}

const getSearchData = asyncHandler(async (req, res) => {
    const api_key = process.env.TMDB_API_KEY;
    const { searchedTerm, page } = req.body;

    if (!searchedTerm || !page) {
        throw new ApiError(400, "Provide proper data")
    }

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/multi?query=${searchedTerm}&api_key=${api_key}&page=${page}&sort_by=popularity.desc`, { httpsAgent: agent, timeout: 10000 });

        const rawResults = response?.data?.results;

        if (rawResults.length === 0) {
            throw new ApiError(400, "No data round from TMDB");
        }

        const formattedResults = rawResults.map(formatData);

        const finalData = {
            page: page,
            results: formattedResults,
            total_pages : response?.data?.total_pages ,
        }

        return res
            .status(200)
            .json(new ApiResponse(200, finalData , "Searched data fetched successfully"))

    } catch (error) {
        throw new ApiError(400, `${error.message}`)
    }
});

export {
    getSearchData
}