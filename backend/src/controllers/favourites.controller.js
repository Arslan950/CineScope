import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Favourites } from "../models/favourites.model.js";
import { User } from "../models/user.model.js";
import crypto from "crypto";

const syncChanges = asyncHandler(async (req, res) => {
    const { favouritesChanges } = req.body;

    if (!favouritesChanges) {
        throw new ApiError(400, "No changes sent !")
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
            new ApiResponse(200, changedFavourites, "Sync data succesfull")
        )
});

const createLink = asyncHandler(async (req, res) => {
    const userID = req.user._id;

    const userFavourites = await Favourites.findOne({ user: userID });

    if (userFavourites && userFavourites.shareToken && userFavourites.shareTokenStatus === "active") {
        let token = userFavourites.shareToken;
        const sharedUrl = `${process.env.FRONTEND_URL}/share/${token}`

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
        throw new ApiError(400, "Unable to create a link")
    }

    const sharedUrl = `${process.env.FRONTEND_URL}/share/${token}`;

    return res
        .status(200)
        .json(new ApiResponse(200, { sharedUrl }, "Link generated succesfully"))
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
        throw new ApiError(400, "Unable to revoke your link")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "link revoked succesfully"))

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
        sharedUrl += `${process.env.FRONTEND_URL}/share/${userFavourites.shareToken}`
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