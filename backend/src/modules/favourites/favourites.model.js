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
    }],
    shareToken : {
        type : String,
        unique : true,
        sparse: true
    },
    shareTokenStatus : {
        type : String,
    }

}, { timestamps: true });

export const Favourites = mongoose.model("favourites", FavouritesSchema);