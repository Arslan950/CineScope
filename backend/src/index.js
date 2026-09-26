import { env } from "./config/env.js";
import app from "./app.js"
import { connectDB } from "./db/server.js";
import { connectRedis } from "./db/redis.js";

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    process.exit(1);
});

connectDB()
    .then(async () => {
        await connectRedis();
        app.listen(env.port, () => {
            console.log(`http://localhost:${env.port}`);
        })
    })
    .catch((error) => {
        console.error(`DB connection failed : ${error}`)
        process.exit(1);
    })