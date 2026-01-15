const jwt = require("jsonwebtoken");

// Model
const User = require("../models/user");

// Error
const {
    ApiError,
    TokenExpireError,
    InvalidTokenError,
    UserNotFoundError,
} = require("../errors");

const ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET;

const token = () => ({
    access(email) {
        return jwt.sign(
            {
                email,
            },
            ACCESS_SECRET_KEY,
            {
                expiresIn: "600m",
                issuer: "lsw",
            }
        );
    },
    refresh(email) {
        return jwt.sign(
            {
                email,
            },
            REFRESH_SECRET_KEY,
            {
                expiresIn: "180 days",
                issuer: "lsw",
            }
        );
    },
});

// 토큰 발급
async function createToken(req, res, next) {
    try {
        const { user } = req;

        const accessToken = token().access(user.email);
        const refreshToken = token().refresh(user.email);

        return res.status(200).json({
            accessToken,
            refreshToken,
        });
    } catch (err) {
        return next(new ApiError());
    }
}

// jwt
async function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new InvalidTokenError();

        const token = authHeader.replace("Bearer ", "");
        const payload = jwt.verify(token, ACCESS_SECRET_KEY);

        const user = await User.findOne({ where: { email: payload.email } });

        if (!user) {
            throw new UserNotFoundError();
        }
        req.user = user;
        return next();
    } catch (err) {
        console.log(err);
        if (err.name === "TokenExpiredError") {
            throw new TokenExpireError();
        }
        if (err.name === "InvalidTokenError") {
            throw new InvalidTokenError();
        }

        return next(new ApiError());
    }
}


async function renewToken(req, res, next) {
    try {
        const authToken = req.cookies.refreshToken;
        if (!authToken) throw new InvalidTokenError();

        const { email } = jwt.verify(authToken, REFRESH_SECRET_KEY);
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new UserNotFoundError();
        }

        const accessToken = token().access(email);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: false,
        });

        return res.status(200).json({
            email: user.email,
        });
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return next(new TokenExpireError());
        }
        if (err.name === "InvalidTokenError") {
            return next(new InvalidTokenError());
        }
        return next(new ApiError());
    }
}

module.exports = {
    createToken,
    verifyToken,
    renewToken,
};