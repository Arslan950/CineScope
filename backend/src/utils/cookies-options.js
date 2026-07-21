import ms from "ms"

const optionsAccessToken = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
};

const optionsRefreshToken = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge : ms(process.env.REFRESH_TOKEN_EXPIRY)
};

export {
    optionsAccessToken,
    optionsRefreshToken
}