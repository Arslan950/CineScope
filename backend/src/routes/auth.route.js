import { Router } from "express"
import {
    register,
    login,
    logout,
    getCurrentUserInfo,
    emailVerification,
    forgetPassword,
    resetPassword,
    refreshAccessToken
} from "../controllers/auth.controller.js";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import { validation } from "../middleware/validator.middleware.js"
import {
    userRegistrationValidator,
    userLoginValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator
} from "../validators/index.js"

const router = Router();

router.route("/register").post(userRegistrationValidator(), validation, register);

router.route("/login").post(userLoginValidator(), validation, login);

router.route("/logout").post(verifyAccessToken, logout);

router.route("/userInfo").get(verifyAccessToken,getCurrentUserInfo);

router.route("/email-verification/:receviedEmailVerificationToken").get(emailVerification);

router.route("/forget-password").post(userForgotPasswordValidator(),validation,forgetPassword);

router.route("/reset-password/:resetPasswordToken").post(userResetForgotPasswordValidator(),validation,resetPassword);

router.route("/refresh-accessToken").post(verifyAccessToken,refreshAccessToken);

export default router;