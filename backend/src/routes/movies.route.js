import { Router } from "express";
import { getSearchData } from "../controllers/movies.controller.js";
import {verifyAccessToken} from "../middleware/auth.middleware.js"


const router = Router() ;

router.route("/search-results").post(verifyAccessToken,getSearchData)


export default router ;