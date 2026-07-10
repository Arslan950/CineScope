import { OAuth2Client } from "google-auth-library"
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.model.js";
import { IntialUser } from "../models/intialUser.model.js"
import { sendEmail, emailVerificationMail, resetPasswordMail } from "../utils/mail.js"
import { optionsAccessToken , optionsRefreshToken } from "../utils/cookies-options.js";
import bcrypt from "bcrypt"
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
};

const generateOTP = (length = 4) => {
    const digit = "0123456789";
    let OTP = "";

    for (let i = 0; i < length; i++) {
        OTP += digit[crypto.randomInt(0, 10)]
    }

    const hashedOTP = crypto
        .createHmac("sha256", process.env.OTP_SERVER_SECRET)
        .update(OTP)
        .digest("hex")

    return { OTP, hashedOTP };
}

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
};

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage'
)

const googleAuth = asyncHandler(async (req, res) => {
    const { code } = req.body;

    if (!code) {
        throw new ApiError(400, "Autherization code is required")
    }

    const { tokens } = await googleClient.getToken(code);
    const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email })

    if (!user) {
        user = await User.create({
            avatar: picture,
            fullName: name,
            googleId: googleId,
            email: email,
            isEmailVerified: true,
        })
    } else if (!user.googleId) {
        user.googleId = googleId;
        await user.save({ validateBeforeSave: false });
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken",
    )

    return res
        .status(200)
        .cookie("accessToken", accessToken, optionsAccessToken)
        .cookie("refreshToken", refreshToken, optionsRefreshToken)
        .json(
            new ApiResponse(200, createdUser, "Account created via Google")
        )
});

const register = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    const existedUser = await User.findOne({ email: email })

    if (existedUser) {
        throw new ApiError(400, "User with same email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const { OTP, hashedOTP } = await generateOTP();

    await IntialUser.deleteOne({ email });

    const tempUser = await IntialUser.create({
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

    const createdUser = await IntialUser.findById(tempUser._id).select(
        "-password -OTP",
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating a temporary  user");
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
        .createHmac("sha256", process.env.OTP_SERVER_SECRET)
        .update(enteredOTP)
        .digest("hex")

    const user = await IntialUser.findOne({
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

    await IntialUser.deleteOne({ _id: user._id });

    const createdUser = await User.findById(createUser._id).select(
        "-password -refreshToken -resetPasswordToken -resetPasswordExpires"
    )

    if (!createdUser) { throw new ApiError(400, "Unable to create final User") }

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
        throw new ApiError(400, "User with this email does not exists");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Incorrect password");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken",
    )

    return res
        .status(200)
        .cookie("accessToken", accessToken, optionsAccessToken)
        .cookie("refreshToken", refreshToken, optionsRefreshToken)
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

    return res
        .status(200)
        .clearCookie("accessToken", optionsAccessToken)
        .clearCookie("refreshToken", optionsRefreshToken)
        .json(
            new ApiResponse(200, {}, "Logged out securly")
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
    )

    if (!updatedUser) { throw new ApiError(400, "Not a valid user") }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedUser , "Info updated succesfully")
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
                `http://localhost:5174/resetPassword/${unHashedToken}`
            )
        })

        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, "Email has been sent to your registered mail")
            )
    } catch (error) {
        throw new ApiError(400, `Something went wrong : ${error}`)
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
    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Fetched user data succesfully !")
        )
})

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
    refreshAccessToken,
}