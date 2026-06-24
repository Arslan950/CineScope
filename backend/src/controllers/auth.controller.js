import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.model.js";

const generateTokens = async (userID) => {
    try {
        const user = await User.findById(userID);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(401, "Unable to create JWT token");
    }
}

const register = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    const existedUser = await User.findOne({email : email})

    if (existedUser) {
        throw new ApiError(400, "User with same email already exists");
    }

    const user = await User.create({
        fullName,
        email,
        password,
        isEmailVerified: false
    });

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = tokenExpiry;

    await user.save({ validateBeforeSave: false });

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

const logout = asyncHandler(async (req,res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : ""
            }
        },
        {
            returnDocument : "after" 
        }
    );

    const options = {
        httpOnly : true ,
        secure : false 
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"Logged out securly")
    )
})

export {
    register,
    login,
    logout,
}