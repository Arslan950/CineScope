import dotenv from "dotenv"
import "dotenv/config"
import app from "./app.js"
import { connectDB } from "./db/server.js";
import { connectRedis } from "./db/redis.js";
const port = process.env.PORT;

connectDB()
    .then(async () => {
        await connectRedis();
        app.listen(port, () => {
            console.log(`http://localhost:${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.error(`DB connection failed : ${error}`)
        process.exit(1);
    })