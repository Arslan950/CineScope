import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthCheckRouter from "./routes/healthCheck.route.js";
import authRouter from "./routes/auth.route.js";


const app = express();

app.use(express.json({limit : "10mb"}));
app.use(express.urlencoded({extended : true , limit : "10kb"}));

app.use(cors({
    origin: "http://localhost:5174",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(cookieParser());

app.use("/api/healthcheck",healthCheckRouter);
app.use("/api/auth",authRouter);

app.get("/" , (req,res) => {
    res.send("hello world")
});

export default app ;