import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.model.js";
import { sendEmail, emailVerificationMail, resetPasswordMail } from "../utils/mail.js"
import crypto from "crypto";
import jwt from "jsonwebtoken";

const generateTokens = async (userID) => {
    try {
        const user = await User.findById(userID);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(401, "Unable to create JWT token");
    }
}

const register = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    const existedUser = await User.findOne({ email: email })

    if (existedUser) {
        throw new ApiError(400, "User with same email already exists");
    }

    const user = await User.create({
        fullName,
        email,
        password,
        isEmailVerified: false
    });

    const { unHashedToken, hashedToken, tokenExpiry } = await user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = tokenExpiry;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user?.email,
        subject: "CineScope Email verification",
        mailgenContent: emailVerificationMail(
            user?.fullName,
            `http://localhost:5174/verify-email/${unHashedToken}`
        )
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpires",
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating a user");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, { user: createdUser }, "user created successfully , A verification email has been sent to your email")
        )

});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "User with this email does not exists");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Your entered password is wrong");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const options = {
        httpOnly: true,
        secure: false
    }

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpires",
    )

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, loggedInUser, "Logged in succesfully!")
        )

})

const logout = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
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

    const options = {
        httpOnly: true,
        secure: false
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "Logged out securly")
        )
});

const forgetPassword = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) { throw new ApiError(400, "No such user exist with this email") }

        const { unHashedToken, hashedToken, tokenExpiry } = await user.generateTemporaryToken();

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = tokenExpiry;

        await user.save({ validateBeforeSave: false })

        await sendEmail({
            email: user?.email,
            subject: "Request to change password",
            mailgenContent: resetPasswordMail(
                user?.fullName,
                `http://localhost:5173/reset-password/${unHashedToken}`
            )
        })

        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, "Email has been sent to your registered mail")
            )
    } catch (error) {
        throw new ApiError(400,`Something went wrong : ${error}`)
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { resetPasswordToken } = req.params;
    const { newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
        throw new ApiError(401, "Please enter same password in both the fields")
    }

    const newHash = crypto.createHash("sha256").update(resetPasswordToken).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: newHash,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) { throw new ApiError(401, "Time limit exceeded , Please try again") }

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Your password has been updated")
        )
});

const getCurrentUserInfo = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Fetched user data succesfully !")
        )
})

const emailVerification = asyncHandler(async (req, res) => {
    const { receviedEmailVerificationToken } = req.params;

    if (!receviedEmailVerificationToken) { throw new ApiError(400, "Time exceeded please try again") }

    const newHash = crypto.createHash("sha256").update(receviedEmailVerificationToken).digest("hex");

    const user = await User.findOne({
        emailVerificationToken: newHash,
        emailVerificationExpires: { $gt: Date.now() }
    })

    if (!user) { throw new ApiError(400, "Something went wrong") }

    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    user.isEmailVerified = true;

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Email verified succesfully ")
        )
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingToken) { throw new ApiError(401, "You are not a Valid user") }

    const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);

    if (!user) {
        throw new ApiError(401, "Invalid refresh Token");
    }

    if (incomingToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh Token is expired");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user?._id);

    const options = {
        httpOnly: true,
        secure: false,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(200, { accessToken, newRefreshToken }, "Assigned new accessToken")
        )
})

export {
    register,
    login,
    logout,
    forgetPassword,
    resetPassword,
    getCurrentUserInfo,
    emailVerification,
    refreshAccessToken,
}