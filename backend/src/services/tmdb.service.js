import { env } from "../config/env.js";
import axios from "axios";
import axiosRetry from "axios-retry";
import https from "https";

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  httpsAgent: new https.Agent({ keepAlive: true, timeout: 60000 }),
  timeout: 10000,
  params: { api_key: env.tmdbApiKey },
});

axiosRetry(tmdb, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (e) =>
    axiosRetry.isNetworkOrIdempotentRequestError(e) ||
    ["ECONNRESET", "ECONNABORTED"].includes(e.code),
});

export default tmdb;