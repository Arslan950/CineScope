import ms from "ms"

const optionsAccessToken = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
};

const optionsRefreshToken = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge : ms(process.env.REFRESH_TOKEN_EXPIRY)
};

export {
    optionsAccessToken,
    optionsRefreshToken
}