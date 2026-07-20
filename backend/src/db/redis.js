import { createClient } from "redis";

let client;
let isRedisConnected = false;

const connectRedis = async () => {
    client = createClient({
        url: process.env.REDIS_URL
    })

    client.on("error", (error) => {
        console.error('❌ Redis connection failed:', error);
        isRedisConnected = false;
    });

    client.on('ready', () => {
        console.log('✅  Connected to Upstash Redis');
        isRedisConnected = true;
    });

    try {
        await client.connect();
    } catch (error) {
        console.error('❌ Redis initial connection failed:', error.message);
    }
};

export { connectRedis, isRedisConnected, client }