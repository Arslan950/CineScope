import { Router } from "express"
import { register, login, logout } from "../controllers/auth.controller.js";
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

router.route("/login").post(userLoginValidator(),validation,login);

router.route("/logout").post(verifyAccessToken,logout);

export default router ;