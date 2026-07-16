import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import axios from "axios";
import axiosRetry from "axios-retry";
import https from "https";
import { millify } from "millify";

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
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : `https://placehold.co/300x450/252525/FFFFFF?text=${item.title || item.name || item.original_title || item.original_name}`,
        rating: item.vote_average ? `${item.vote_average.toFixed(1)}/10` : item.vote_average,
        type: item.media_type
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
            total_pages: response?.data?.total_pages,
        }

        return res
            .status(200)
            .json(new ApiResponse(200, finalData, "Searched data fetched successfully"))

    } catch (error) {
        throw new ApiError(400, `${error.message}`)
    }
});

const formatMovieData = (item) => {
    const rawDirector = item.credits?.crew?.find(member => member.job === 'Director');
    const director = rawDirector ? {
        real_name: rawDirector.name,
        role: rawDirector.job,
        picture: rawDirector.profile_path ? `https://image.tmdb.org/t/p/w200${rawDirector.profile_path}` : `https://placehold.co/200x300/111826/FFFFFF?text=${rawDirector.name}`
    } : null;

    const firstProducer = item.production_companies[0];

    const production_company = firstProducer ? {
        logo: firstProducer.logo_path ? `https://image.tmdb.org/t/p/w200${firstProducer.logo_path}` : `https://placehold.co/300x800/111826/FFFFFF?text=${firstProducer.name}`,
        name: firstProducer.name
    } : null;

    const topCast = item.credits?.cast?.slice(0, 20).map(actor => ({
        real_name: actor.name,
        role: actor.character,
        picture: actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : `https://placehold.co/200x300/111826/FFFFFF?text=${actor.name}`
    })) || [];

    const trailerKey = item.videos?.results?.find(
        video => video.site === 'YouTube' && video.type === 'Trailer' && video.official === true
    )?.key || null;

    const genres = item.genres?.map(genre => genre.name) || [];

    return {
        id: item.id,
        title: item.title,
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w400${item.poster_path}` : "https://placehold.co/300x450/252525/FFFFFF?text=No+poster+availabe",
        backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/w1920${item.backdrop_path}` : `https://placehold.co/1920x750/111826/FFFFFF?text=${item.title}`,
        runtime: item.runtime,
        rating: item.vote_average ? `${item.vote_average.toFixed(1)}/10` : item.vote_average,
        imdb_id: item.imdb_id,
        release_date: item.release_date,
        overview: item.overview,
        status: item.status,
        budget: millify(item.budget),
        trailer: trailerKey ? `https://www.youtube.com/embed/${trailerKey}` : null,
        genres: genres,
        director: director,
        production_company: production_company,
        cast: topCast,
    };
};

const getMoviesDetail = asyncHandler(async (req, res) => {
    const api_key = process.env.TMDB_API_KEY
    const { id } = req.body;

    if (!id) {
        throw new ApiError(400, "Please provide a movie");
    }

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&append_to_response=credits,videos`, { httpsAgent: agent, timeout: 10000 });

        const finalData = formatMovieData(response.data);

        if (!finalData) {
            throw new ApiError(400, "Failed to fetch details from TMDB")
        }

        return res
            .status(200)
            .json(new ApiResponse(200, finalData, "Fetched movies data successfully"))


    } catch (error) {
        throw new ApiError(400, `${error.message}`)
    }
});

const formatTVData = (item) => {
    const creators = item.created_by?.map(creator => ({
        real_name: creator.name,
        role: "Creator",
        picture: creator.profile_path ? `https://image.tmdb.org/t/p/w200${creator.profile_path}` : `https://placehold.co/200x300/111826/FFFFFF?text=${encodeURIComponent(creator.name)}`
    })) || [];

    const firstProducer = item.production_companies?.[0];
    const production_company = firstProducer ? {
        logo: firstProducer.logo_path ? `https://image.tmdb.org/t/p/w200${firstProducer.logo_path}` : `https://placehold.co/200x300/111826/FFFFFF?text=${encodeURIComponent(firstProducer.name)}`,
        name: firstProducer.name
    } : null;

    const cast = item.credits?.cast?.map(actor => ({
        real_name: actor.name,
        role: actor.character,
        picture: actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : `https://placehold.co/200x300/111826/FFFFFF?text=${encodeURIComponent(actor.name)}`
    })) || [];

    const trailerKey = item.videos?.results?.find(
        video => video.site === 'YouTube' && video.type === 'Trailer'
    )?.key || null;

    const genres = item.genres?.map(genre => genre.name) || [];

    const seasons = item.seasons?.map(season => ({
        name: season.name,
        episode_count: season.episode_count,
        poster_path: season.poster_path ? `https://image.tmdb.org/t/p/w200${season.poster_path}` : `https://placehold.co/200x300/111826/FFFFFF?text=${encodeURIComponent(season.name)}`
    })) || [];

    return {
        id: item.id,
        title: item.name,
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w400${item.poster_path}` : "https://placehold.co/300x450/252525/FFFFFF?text=No+poster+available",
        backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/w1920${item.backdrop_path}` : `https://placehold.co/1920x750/111826/FFFFFF?text=${encodeURIComponent(item.original_name || item.name)}`,
        runtime: item.episode_run_time?.[0] || "Not specified",
        rating: item.vote_average ? `${item.vote_average.toFixed(1)}/10` : item.vote_average,
        release_date: item.first_air_date,
        overview: item.overview,
        status: item.status,
        trailer: trailerKey ? `https://www.youtube.com/embed/${trailerKey}` : null,
        genres: genres,
        creators: creators,
        production_company: production_company,
        seasons: seasons,
        cast: cast,
    };
};

const getTVDetails = asyncHandler(async (req, res) => {
    const api_key = process.env.TMDB_API_KEY;
    const { id } = req.body;

    if(!id) {
        throw new ApiError(400, "Please provide a movie");
    }

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${api_key}&append_to_response=credits,videos`, { httpsAgent: agent, timeout: 10000 });

        const finalData = formatTVData(response.data);

        if(!finalData) {
            throw new ApiError(400, "Failed to fetch details from TMDB")
        }

        return res
            .status(200)
            .json(new ApiResponse(200, finalData, "Fetched TV data successfully"))

    } catch (error) {
        throw new ApiError(400, `${error.message}`)
    }
});

export {
    getSearchData,
    getMoviesDetail,
    getTVDetails
}