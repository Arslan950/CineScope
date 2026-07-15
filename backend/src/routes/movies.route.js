import { Router } from "express";
import { getSearchData , getMoviesDetail } from "../controllers/movies.controller.js";
import {verifyAccessToken} from "../middleware/auth.middleware.js"


const router = Router() ;

router.route("/search-results").post(verifyAccessToken,getSearchData);
router.route("/movie-result").post(verifyAccessToken,getMoviesDetail);


export default router ;