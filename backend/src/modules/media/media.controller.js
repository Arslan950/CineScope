import { ApiResponse } from "../../utils/api-response.js";
import { ApiError } from "../../utils/api-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { formatSearchResults, formatMovieData, formatTVData } from "./media.formatter.js";
import tmdb from "../../services/tmdb.service.js";

const getSearchData = asyncHandler(async (req, res) => {
    const { searchedTerm, page } = req.query;

    if (!searchedTerm || !page) {
        throw new ApiError(400, "Search term and page number are required");
    }

    const response = await tmdb.get('/search/multi', {
        params: {
            query: searchedTerm,
            page: page,
            sort_by: 'popularity.desc'
        }
    });

    const rawResults = response?.data?.results;

    if (rawResults.length === 0) {
        throw new ApiError(404, "No search results found");
    }

    const formattedResults = rawResults.filter(item => item.media_type !== 'person').map(formatSearchResults);

    const finalData = {
        page: page,
        results: formattedResults,
        total_pages: response?.data?.total_pages,
    };

    return res
        .status(200)
        .json(new ApiResponse(200, finalData, "Searched data fetched successfully"));
});

const getMoviesDetail = asyncHandler(async (req, res) => {
    const { id } = req.query;

    if (!id) {
        throw new ApiError(400, "Movie ID is required");
    }

    const response = await tmdb.get(`/movie/${id}`, {
        params: {
            append_to_response: 'credits,videos'
        }
    });

    const finalData = formatMovieData(response.data);

    if (!finalData) {
        throw new ApiError(502, "Failed to retrieve movie details from the external provider");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, finalData, "Fetched movies data successfully"));
});

const getTVDetails = asyncHandler(async (req, res) => {
    const { id } = req.query;

    if (!id) {
        throw new ApiError(400, "Please provide a movie");
    }

    const response = await tmdb.get(`/tv/${id}`, {
        params: {
            append_to_response: 'credits,videos'
        }
    });

    const finalData = formatTVData(response.data);

    if (!finalData) {
        throw new ApiError(400, "Failed to fetch details from TMDB");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, finalData, "Fetched TV data successfully"));
});

export {
    getSearchData,
    getMoviesDetail,
    getTVDetails
};