import { ApiError } from "../utils/api-error.js";

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res
            .status(err.statusCode)
            .json({
                success: err.success,
                message: err.message,
                errors: err.errors,
                data: err.data,
            });
    }

    if (err.isAxiosError) {
        console.error(err);
        return res.status(502).json({
            success: false,
            message: "Upstream service unavailable",
        });
    }

    console.error(err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};

export { errorHandler };