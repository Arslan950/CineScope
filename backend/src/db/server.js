import mongoose from "mongoose";
import {env} from "../config/env.js"

const connectDB = async () => {
    try {
        await mongoose.connect(env.mongoUri);
        console.log("✅ Connected to DB");
    } catch (error) {
        console.log("❌ Connection Failed",error);
        process.exit(1);
    }
}


export {connectDB};