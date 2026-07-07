import { Router } from "express"
import {
    googleAuth,
    register,
    verifyUser,
    login,
    logout,
    getCurrentUserInfo,
    updateUserInfo ,
    forgetPassword,
    resetPassword,
    refreshAccessToken
} from "../controllers/auth.controller.js";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import { validation } from "../middleware/validator.middleware.js"
import {
    userRegistrationValidator,
    userOTPValidator ,
    userLoginValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator
} from "../validators/index.js"

const router = Router();

router.route("/google").post(googleAuth);

router.route("/register").post(userRegistrationValidator(), validation, register);

router.route("/verifyOTP").post(userOTPValidator(),validation,verifyUser);

router.route("/login").post(userLoginValidator(), validation, login);

router.route("/logout").post(verifyAccessToken, logout);

router.route("/userInfo").get(verifyAccessToken,getCurrentUserInfo);

router.route("/editInfo").patch(verifyAccessToken,updateUserInfo);

router.route("/forget-password").post(userForgotPasswordValidator(),validation,forgetPassword);

router.route("/reset-password/:resetPasswordToken").post(userResetForgotPasswordValidator(),validation,resetPassword);

router.route("/refresh-accessToken").post(refreshAccessToken);

export default router;