import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { favourites } from "../models/favourites.model.js";

const syncChanges = asyncHandler(async (req, res) => {
    const { favouritesChanges } = req.body;

    if (!favouritesChanges) {
        throw new ApiError(400, "No changes sent !")
    }

    const changedFavourites = await favourites.findOneAndUpdate(
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

const getFavouritesList = asyncHandler(async (req, res) => {
    const userFavourites = await favourites.findOne(
        {
            user: req.user._id
        }
    ).select("-user -_id -__v -createdAt -updatedAt")

    if (!userFavourites) {
        return res
            .status(200)
            .json(new ApiResponse(200, { favourites: [] }, "Empty favourites list sent successfully !"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, userFavourites, "favourites list sent successfully !"));
});

export {
    syncChanges,
    getFavouritesList
}