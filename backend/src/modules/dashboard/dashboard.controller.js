import tmdb from "../../services/tmdb.service.js";
import { formatItem } from "./dashboard.formatter.js";
import { ApiResponse } from "../../utils/api-response.js";
import { ApiError } from "../../utils/api-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { client, isRedisConnected } from "../../db/redis.js";

const requests = {
    hollywood: {
        path: "/trending/movie/day"
    },
    bollywood: {
        path: "/discover/movie",
        params: {
            with_original_language: "hi",
            "primary_release_date.gte": "2026-01-01",
            "primary_release_date.lte": "2026-12-31",
            sort_by: "popularity.desc",
            page: 1,
            region: "IN"
        }
    },
    webSeries: {
        path: "/trending/tv/day"
    }
}

const getTrendingData = asyncHandler(async (req, res) => {
    const cache_key = "dashboard_data";
    if (isRedisConnected) {
        const cachedData = await client.get(cache_key);

        if (cachedData) {
            return res
                .status(200)
                .json(new ApiResponse(200, JSON.parse(cachedData), "data fetched from redis successfully"));
        }
    }

    const [hollywoodRes, bollywoodRes, webSeriesRes] = await Promise.all([
        tmdb.get(requests.hollywood.path),
        tmdb.get(requests.bollywood.path, { params: requests.bollywood.params }),
        tmdb.get(requests.webSeries.path)
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
        await client.setEx(cache_key, 43200, JSON.stringify(finalData));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, finalData, "Trending Data fetched successfully"));
});

export {
    getTrendingData
}