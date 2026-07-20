import mongoose, { Schema } from "mongoose";

const FavouritesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
    },
    favourites: [{
        id: {
            type: String
        },
        title: {
            type: String
        },
        poster: {
            type: String
        },
        rating: {
            type: String
        },
        type: {
            type: String
        },
    }]

}, { timestamps: true });

export const favourites = mongoose.model("favourites", FavouritesSchema);