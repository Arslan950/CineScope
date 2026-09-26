import {env} from "../../config/env.js"
import { User } from "./user.model.js";
import { ApiError } from "../../utils/api-error.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

const generateTokens = async (userID) => {
    try {
        const user = await User.findById(userID);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Failed to generate authentication tokens");
    }
};

const generateOTP = (length = 4) => {
    const digit = "0123456789";
    let OTP = "";

    for (let i = 0; i < length; i++) {
        OTP += digit[crypto.randomInt(0, 10)]
    }

    const hashedOTP = crypto
        .createHmac("sha256", env.otpServerSecret)
        .update(OTP)
        .digest("hex")

    return { OTP, hashedOTP };
}

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
};

export {
    generateTokens ,
    generateOTP ,
    hashPassword
}