import { body } from "express-validator";

const userRegistrationValidator = () => {
    return [
        body("fullName")
            .trim()
            .notEmpty()
            .withMessage("Full name is required")
            .isLength({ min: 3 })
            .withMessage("Full name must be at least 3 characters long"),

        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Please provide a valid email address")
            .normalizeEmail(),

        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long"),
    ]
};

const userOTPValidator = () => {
    return [
        body("enteredOTP")
            .trim()
            .notEmpty()
            .withMessage("OTP is required")
            .isLength({min : 4})
            .withMessage("OTP must be at least 4 digit long")
    ]
}

const userLoginValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Please provide a valid email address")
            .normalizeEmail(),

        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long"),
    ]
};

const userForgotPasswordValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Please provide a valid email address")
            .normalizeEmail(),
    ]
};

const userResetForgotPasswordValidator = () => {
    return [
        body("newPassword")
            .trim()
            .notEmpty()
            .withMessage("New password is required")
            .isLength({ min: 8 })
            .withMessage("New password must be at least 8 characters long"),
    ]
};

export {
    userRegistrationValidator,
    userOTPValidator ,
    userLoginValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator
}