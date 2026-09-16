import { Router } from "express";
import { getSearchData , getMoviesDetail , getTVDetails} from "../controllers/movies.controller.js";
import {verifyAccessToken} from "../middleware/auth.middleware.js"


const router = Router() ;

router.route("/search-results").get(verifyAccessToken,getSearchData);
router.route("/movie-result").get(verifyAccessToken,getMoviesDetail);
router.route("/tv-result").get(verifyAccessToken,getTVDetails);


export default router ;