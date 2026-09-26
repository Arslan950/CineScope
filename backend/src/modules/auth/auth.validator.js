import { body } from "express-validator";

const userRegistrationValidator = () => {
    return [
        body("fullName")
            .trim()
            .notEmpty()
            .withMessage("Full name is required")
            .isLength({ min: 3, max: 50 })
            .withMessage("Full name must be between 3 and 50 characters long"),

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
            .isLength({ min: 8, max: 15 })
            .withMessage("Password must be between 8 and 15 characters long"),
    ]
};

const userOTPValidator = () => {
    return [
        body("enteredOTP")
            .trim()
            .notEmpty()
            .withMessage("OTP is required")
            .isLength({ min: 4, max: 4 })
            .withMessage("OTP must be exactly 4 digits long")
            .isNumeric()
            .withMessage("OTP must contain only digits"),
    ]
};

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
            .isLength({ min: 8, max: 15 })
            .withMessage("Password must be between 8 and 15 characters long"),
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
            .isLength({ min: 8, max: 15 })
            .withMessage("New password must be between 8 and 15 characters long"),
    ]
};

export {
    userRegistrationValidator,
    userOTPValidator,
    userLoginValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator
}