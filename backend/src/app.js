import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthCheckRouter from "./modules/healthCheck/healthCheck.route.js";
import authRouter from "./modules/auth/auth.route.js";
import dashboardRouter from "./modules/dashboard/dashboard.route.js";
import moviesRouter from "./modules/media/media.route.js";
import favouritesRouter from "./modules/favourites/favourites.route.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import { ApiError } from "./utils/api-error.js";
import { env } from "./config/env.js";


const app = express();

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(cors({
    origin: env.cors,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(cookieParser());

app.use("/api/healthcheck", healthCheckRouter);
app.use("/api/auth", authRouter);
app.use("/api/get-dashboard-data", dashboardRouter);
app.use("/api/explore", moviesRouter);
app.use("/api/favourites", favouritesRouter);

app.use((req, res, next) => {
    next(new ApiError(404, `Resource not found: ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("hello world")
});

export default app;