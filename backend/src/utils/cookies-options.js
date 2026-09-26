import ms from "ms"
import { env } from "../config/env.js";

const optionsAccessToken = {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'Lax', 
};

const optionsRefreshToken = {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'Lax',
    maxAge : ms(env.refreshTokenExpiry)
};

export {
    optionsAccessToken,
    optionsRefreshToken
}