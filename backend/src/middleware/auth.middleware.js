import {User} from "../modules/auth/user.model.js"
import {ApiError} from "../utils/api-error.js";
import {asyncHandler} from "../utils/async-handler.js";
import {env} from "../config/env.js"
import jwt from "jsonwebtoken";

export const verifyAccessToken = asyncHandler(async(req,res,next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if(!token){
        throw new ApiError(401, "Invalid access token");
    }

    try {
        const decodedToken = jwt.verify(token,env.accessTokenSecret);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if(!user){
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user ;
        next();
    } catch (error) {
       throw new ApiError(401, "Invalid access token"); 
    }

});
