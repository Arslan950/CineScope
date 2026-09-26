import { ApiResponse } from "../../utils/api-response.js";
import { ApiError } from "../../utils/api-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { Favourites } from "./favourites.model.js";
import { User } from "../auth/user.model.js";
import crypto from "crypto";
import { env } from "../../config/env.js";

const syncChanges = asyncHandler(async (req, res) => {
    const { favouritesChanges } = req.body;

    if (!favouritesChanges) {
        throw new ApiError(400, "No favorite changes provided in the request payload")
    }

    const changedFavourites = await Favourites.findOneAndUpdate(
        {
            user: req.user._id
        },
        {
            $set: { favourites: favouritesChanges },
        },
        {
            returnDocument: "after",
            upsert: true,
            runValidators: true,
        }
    );

    if (!changedFavourites) {
        throw new ApiError(400, "Unable to sync changes")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, changedFavourites, "Sync data successfull")
        )
});

const createLink = asyncHandler(async (req, res) => {
    const userID = req.user._id;

    const userFavourites = await Favourites.findOne({ user: userID });

    if (userFavourites && userFavourites.shareToken && userFavourites.shareTokenStatus === "active") {
        let token = userFavourites.shareToken;
        const sharedUrl = `${env.frontendUrl}/share/${token}`

        return res
            .status(200)
            .json(new ApiResponse(200, { sharedUrl }, "Existing share link retrieved"))
    }

    const token = crypto.randomUUID();

    const updatedFavourites = await Favourites.findOneAndUpdate(
        {
            user: userID,
        },
        {
            $set: {
                shareToken: token,
                shareTokenStatus: "active"
            }
        },
        {
            returnDocument: "after",
            upsert: true,
            runValidators: true,
        }
    );

    if (!updatedFavourites) {
        throw new ApiError(500, "Internal server error: Failed to update shareable link")
    }

    const sharedUrl = `${env.frontendUrl}/share/${token}`;

    return res
        .status(200)
        .json(new ApiResponse(200, { sharedUrl }, "Link generated successfully"))
});

const revokeLink = asyncHandler(async (req, res) => {
    const userID = req.user._id;

    const updatedUser = await Favourites.findOneAndUpdate(
        {
            user: userID
        },
        {
            $unset: { shareToken: 1 },
            $set: {
                shareTokenStatus: "revoked"
            }
        },
        {
            returnDocument: "after",
            upsert: true,
            runValidators: true,
        }
    );

    if (!updatedUser) {
        throw new ApiError(500, "Internal server error: Failed to update shareable link")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "link revoked successfully"))

});

const getSharedFavourites = asyncHandler(async (req, res) => {
    const { Sharetoken } = req.params;

    const sharedData = await Favourites.findOne({
        shareToken: Sharetoken,
        shareTokenStatus: "active"
    }).select("favourites user -_id").lean();

    if (!sharedData) {
        throw new ApiError(404, "This collection is no longer shared or does not exist");
    }

    const userId = sharedData.user;
    const user = await User.findOne({ _id: userId }).select("avatar fullName -_id").lean();
    delete sharedData.user ;

    const formatData = {
        ...sharedData,
        userDetails : {
            ...user
        }
    }
    
    return res
        .status(200)
        .json(new ApiResponse(200, formatData , "Shared collection fetched successfully"));
});

const getFavouritesList = asyncHandler(async (req, res) => {
    const userFavourites = await Favourites.findOne(
        {
            user: req.user._id
        }
    ).select("-user -_id -__v -createdAt -updatedAt").lean();

    if (!userFavourites) {
        return res
            .status(200)
            .json(new ApiResponse(200, { favourites: [] , sharedurl : "" }, "Empty favourites list sent successfully !"));
    }

    let sharedUrl = "";
    if(userFavourites.shareToken && userFavourites.shareTokenStatus === "active"){
        sharedUrl += `${env.frontendUrl}/share/${userFavourites.shareToken}`
    }

    delete userFavourites.shareToken;
    delete userFavourites.shareTokenStatus ;

    return res
        .status(200)
        .json(new ApiResponse(200, {...userFavourites,sharedUrl} , "favourites list sent successfully !"));
});

export {
    syncChanges,
    createLink,
    revokeLink,
    getSharedFavourites,
    getFavouritesList
}