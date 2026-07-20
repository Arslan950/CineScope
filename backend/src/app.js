import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthCheckRouter from "./routes/healthCheck.route.js";
import authRouter from "./routes/auth.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import moviesRouter from "./routes/movies.route.js";
import favouritesRouter from "./routes/favourites.route.js";
import { ApiError } from "./utils/api-error.js";


const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(cors({
    origin: "http://localhost:5174",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(cookieParser());

app.use("/api/healthcheck", healthCheckRouter);
app.use("/api/auth", authRouter);
app.use("/api/get-dashboard-data",dashboardRouter);
app.use("/api/explore",moviesRouter);
app.use("/api/favourites",favouritesRouter)

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res
            .status(err.statusCode)
            .json({
                success: err.success,
                message: err.message,
                errors: err.errors,
                data: err.data
            })
    }

    console.error(err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});

app.get("/", (req, res) => {
    res.send("hello world")
});

export default app;