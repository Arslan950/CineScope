import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken"

const UserSchema = new Schema({
    avatar: {
        type: String,
        default : "https://res.cloudinary.com/dadnb58fk/image/upload/v1783945175/sk4bfdfewzwc57pfodgu.png"
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [function () {
            return !this.googleId;
        }, 'Password is required'],
        minlength: 8
    },
    genres: {
        type: [String],
        default: ["Comedy", "sc-fi", "horror"]
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, { timestamps: true })

UserSchema.methods.isPasswordCorrect = async function (password) {

    if (!this.password) {
        return false;
    }

    return await bcrypt.compare(password, this.password)
};

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
};

UserSchema.methods.generateRefreshToken = function name(params) {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
};

UserSchema.methods.generateTemporaryToken = async function () {
    const unHashedToken = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex");

    const tokenExpiry = Date.now() + (20 * 60 * 1000);

    return { unHashedToken, hashedToken, tokenExpiry };
};

export const User = mongoose.model("User", UserSchema);