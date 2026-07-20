import { Router } from "express";
import {verifyAccessToken} from "../middleware/auth.middleware.js";
import { getFavouritesList , syncChanges } from "../controllers/favourites.controller.js";

const router = Router() ;

router.route("/sync").put(verifyAccessToken,syncChanges);
router.route("/get-list").get(verifyAccessToken,getFavouritesList)

export default router ;
