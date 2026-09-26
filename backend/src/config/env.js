import "dotenv/config";

const requiredVars = [
  "PORT",
  "CORS",
  "FRONTEND_URL",
  "MONGO_URI",
  "REDIS_URL",
  "TMDB_API_KEY",
  "ACCESS_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRY",
  "REFRESH_TOKEN_SECRET",
  "REFRESH_TOKEN_EXPIRY",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "OTP_SERVER_SECRET",
  "BREVO_API_KEY",
  "MAIL_FROM",
];

const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

export const env = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV || "development",
  cors: process.env.CORS,
  frontendUrl: process.env.FRONTEND_URL,
  mongoUri: process.env.MONGO_URI,
  redisUrl: process.env.REDIS_URL,
  tmdbApiKey: process.env.TMDB_API_KEY,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  otpServerSecret: process.env.OTP_SERVER_SECRET,
  brevoApiKey: process.env.BREVO_API_KEY,
  mailFrom: process.env.MAIL_FROM,
};