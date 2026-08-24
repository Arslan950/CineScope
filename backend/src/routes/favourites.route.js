import { Router } from "express";
import {verifyAccessToken} from "../middleware/auth.middleware.js";
import { createLink, getFavouritesList , getSharedFavourites, revokeLink, syncChanges } from "../controllers/favourites.controller.js";

const router = Router() ;

router.route("/sync").put(verifyAccessToken,syncChanges);
router.route("/get-list").get(verifyAccessToken,getFavouritesList)
router.route("/generate-link").post(verifyAccessToken,createLink)
router.route("/revoke-link").post(verifyAccessToken,revokeLink)
router.route("/get-shared-list/:Sharetoken").get(getSharedFavourites);

export default router ;
