import { env } from "../../config/env.js";
import { OAuth2Client } from "google-auth-library"
import { ApiResponse } from "../../utils/api-response.js";
import { ApiError } from "../../utils/api-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { User } from "./user.model.js";
import { InitialUser } from "./initialUser.model.js";
import { Favourites } from "../favourites/favourites.model.js";
import { sendEmail, emailVerificationMail, resetPasswordMail } from "../../utils/mail.js"
import { optionsAccessToken, optionsRefreshToken } from "../../utils/cookies-options.js";
import { generateTokens, generateOTP, hashPassword } from "./auth.service.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const googleClient = new OAuth2Client(
    env.googleClientId,
    env.googleClientSecret,
    'postmessage'
)

const googleAuth = asyncHandler(async (req, res) => {
    const { code } = req.body;

    if (!code) {
        throw new ApiError(400, "Authorization code is required")
    }

    const { tokens } = await googleClient.getToken(code);
    const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: env.googleClientId,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });
    let newUser = false;

    if (!user) {
        user = await User.create({
            avatar: picture,
            fullName: name,
            googleId: googleId,
            email: email,
            isEmailVerified: true,
        })
        newUser = true;
    } else if (!user.googleId) {
        user.googleId = googleId;
        await user.save({ validateBeforeSave: false });
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken",
    ).lean()

    const finalResult = {
        ...createdUser,
        newUser: newUser
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, optionsAccessToken)
        .cookie("refreshToken", refreshToken, optionsRefreshToken)
        .json(
            new ApiResponse(200, finalResult, "Account created via Google")
        )
});

const register = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    const existedUser = await User.findOne({ email: email })

    if (existedUser) {
        throw new ApiError(409, "A user with this email address already exists");
    }

    const hashedPassword = await hashPassword(password);

    const { OTP, hashedOTP } = await generateOTP();

    await InitialUser.deleteOne({ email });

    const tempUser = await InitialUser.create({
        fullName,
        email,
        password: hashedPassword,
        OTP: hashedOTP
    })

    await sendEmail({
        email: tempUser?.email,
        subject: "CineScope Email verification",
        mailgenContent: emailVerificationMail(
            tempUser?.fullName,
            OTP
        )
    })

    const createdUser = await InitialUser.findById(tempUser._id).select(
        "-password -OTP",
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating a temporary user");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, { tempUser: createdUser }, "A verification email has been sent to your email")
        )

});

const verifyUser = asyncHandler(async (req, res) => {
    const { email, enteredOTP } = req.body;
    if (!enteredOTP) { throw new ApiError(400, "Please Provide a valid OTP") }

    const hashedOTP = crypto
        .createHmac("sha256", env.otpServerSecret)
        .update(enteredOTP)
        .digest("hex")

    const user = await InitialUser.findOne({
        email: email,
        OTP: hashedOTP,
        createdAt: { $gt: new Date(Date.now() - 10 * 60 * 1000) }
    });

    if (!user) { throw new ApiError(400, "Invalid OTP") }

    const createUser = await User.create({
        fullName: user?.fullName,
        email: user?.email,
        password: user?.password,
        isEmailVerified: true
    });

    await InitialUser.deleteOne({ _id: user._id });

    const createdUser = await User.findById(createUser._id).select(
        "-password -refreshToken -resetPasswordToken -resetPasswordExpires"
    )

    if (!createdUser) { throw new ApiError(500, "Failed to finalize user registration") }

    return res
        .status(200)
        .json(
            new ApiResponse(200, { user: createdUser }, "User created successfully")
        )

})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "Invalid email or password");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid email or password.");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-_id -password -refreshToken -createdAt -updatedAt -__v -googleId -resetPasswordToken -resetPasswordExpires",
    )

    return res
        .status(200)
        .cookie("accessToken", accessToken, optionsAccessToken)
        .cookie("refreshToken", refreshToken, optionsRefreshToken)
        .json(
            new ApiResponse(200, loggedInUser, "Logged in successfully!")
        )

})

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: ""
            }
        },
        {
            returnDocument: "after"
        }
    );

    return res
        .status(200)
        .clearCookie("accessToken", optionsAccessToken)
        .clearCookie("refreshToken", optionsRefreshToken)
        .json(
            new ApiResponse(200, {}, "Logged out securely")
        )
});

const updateUserInfo = asyncHandler(async (req, res) => {
    const { avatar, genres, fullName } = req.body;

    const updateData = {};

    if (avatar) updateData.avatar = avatar;
    if (genres) updateData.genres = genres;
    if (fullName) updateData.fullName = fullName;

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "Please provide at least one field to update");
    }

    const updatedUser = await User.findOneAndUpdate(
        {
            _id: req.user._id
        },
        {
            $set: updateData,
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    ).select("-_id -password -refreshToken -googleId -resetPasswordToken -resetPasswordExpires -createdAt -updatedAt -__v")

    if (!updatedUser) { throw new ApiError(404, "User profile not found") }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedUser, "Info updated successfully")
        )


});

const forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) { throw new ApiError(404, "User profile not found") }

    const { unHashedToken, hashedToken, tokenExpiry } = await user.generateTemporaryToken();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = tokenExpiry;

    await user.save({ validateBeforeSave: false })

    await sendEmail({
        email: user?.email,
        subject: "Request to change password",
        mailgenContent: resetPasswordMail(
            user?.fullName,
            `${env.frontendUrl}/resetPassword/${unHashedToken}`
        )
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Email has been sent to your registered mail")
        )
});

const resetPassword = asyncHandler(async (req, res) => {
    const { resetPasswordToken } = req.params;
    const { newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
        throw new ApiError(400, "Passwords do not match")
    }

    const newHash = crypto.createHash("sha256").update(resetPasswordToken).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: newHash,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) { throw new ApiError(400, "The password reset token is invalid or has expired") }

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    const newPasswordHash = await hashPassword(newPassword)

    user.password = newPasswordHash;

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Your password has been updated")
        )
});

const getCurrentUserInfo = asyncHandler(async (req, res) => {
    const plainUser = req.user.toObject ? req.user.toObject() : req.user;
    const { _id, __v, createdAt, updatedAt, googleId, ...cleanUser } = plainUser;

    return res
        .status(200)
        .json(
            new ApiResponse(200, cleanUser, "Fetched user data successfully!")
        );
});

const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const deletedUser = await User.findByIdAndDelete(userId).session(session);

        if (!deletedUser) {
            throw new ApiError(500, "Failed to delete user account");
        }

        await Favourites.deleteMany({ user: userId }).session(session);

        await session.commitTransaction();

    } catch (error) {
        await session.abortTransaction();
        throw new ApiError(400, "Unable to delete your account");
    } finally {
        session.endSession();
    }

    return res
        .status(200)
        .clearCookie("accessToken", optionsAccessToken)
        .clearCookie("refreshToken", optionsRefreshToken)
        .json(
            new ApiResponse(200, {}, "User account and associated data deleted successfully")
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingToken) { throw new ApiError(401, "Unauthorized: Refresh token is missing") }

    const decodedToken = jwt.verify(incomingToken, env.refreshTokenSecret);
    const user = await User.findById(decodedToken?._id);

    if (!user) {
        throw new ApiError(401, "Invalid refresh Token");
    }

    if (incomingToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh Token is expired");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user?._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, optionsAccessToken)
        .cookie("refreshToken", newRefreshToken, optionsRefreshToken)
        .json(
            new ApiResponse(200, { accessToken, newRefreshToken }, "Assigned new accessToken")
        )
})

export {
    googleAuth,
    register,
    verifyUser,
    login,
    logout,
    updateUserInfo,
    forgetPassword,
    resetPassword,
    getCurrentUserInfo,
    deleteUser,
    refreshAccessToken,
}