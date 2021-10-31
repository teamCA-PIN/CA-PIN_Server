import config from "../config";
import jwt from "jsonwebtoken";
import User from "../models/User";
const createError = require('http-errors');
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");

const verifyToken = async(token) => { 
    try { 
        return jwt.verify(token, process.env.JWT_SECRET); 
    } catch (err) {
        switch (err.name) {
        // 토큰 유효기간만 지난경우
        case 'TokenExpiredError':
            return undefined
        // 토큰 형태가 아닌경우 조작된 경우
        case 'JsonWebTokenError':
            return null
        }
    }
};

const parseJwt = async(token) => {
    try {
        let base64Url = token.split('.')[1]; // token you get
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        let decodedData = JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
        return decodedData
    } catch (err) {
        return null;
    }
};

const generateToken = async(userId) => {
    // Return jsonwebtoken
    const token = jwt.sign(
        { sub: userId }, 
        config.jwtSecret, 
        { expiresIn: '1d' });

    return token
};

const generateRefreshToken = async(userId) => {
    // Return jsonwebtoken
    const token = jwt.sign(
        { sub: userId }, 
        config.jwtSecret, 
        { expiresIn: '30d' });

    const user = await User.findOneAndUpdate(
        { 
            _id: userId
        },
        { 
            $set: {token_refresh: token}
        },
        { 
            new: true,
            upsert: true,
            useFindAndModify: false
        });

    return user
};

const generateTokenWithRefresh = async(token_access, token_refresh) => {
    const accessToken = await verifyToken(token_access);
    const refreshToken = await verifyToken(token_refresh);

    // 토큰 형식이 이상하다면 재발급 거부
    if ((accessToken === null) || (refreshToken === null)) {
        throw createError(statusCode.UNAUTHORIZED,responseMessage.INVALID_TOKEN);
    }

    // 엑세스, 리프레시 둘 다 만료되었다면 다시 로그인해야함
    if ((accessToken === undefined) && (refreshToken === undefined)) {
        // 엑세스, 리프레시 둘 다 만료되었다면 다시 로그인해야함
        throw createError(statusCode.UNAUTHORIZED,responseMessage.NO_REGEN_TOKEN);
    // 문제없다면 토큰 재발급
    } else if (refreshToken != undefined) {
        const user = await User.findOne({ token_refresh });
        // 없는 유저
        if (!user) {
            throw createError(statusCode.NOT_FOUND,responseMessage.READ_USER_FAIL);
        }

        const token_access = await generateToken(user._id)

        // 리프레시 토큰의 유효기간이 7일 미만이라면 리프레시 토큰도 재발급
        const decodedPayload = await parseJwt(token_refresh);
        if ((decodedPayload.exp)-Math.floor(Date.now()/1000) <= 604800) {
            const refresh = await generateRefreshToken(user._id)
            
            return {
                "token_access": token_access,
                "token_refresh": refresh.token_refresh
            }
        }

        return {
            "token_access": token_access,
        }
    }
}
  
module.exports = {
    generateToken,
    generateRefreshToken,
    generateTokenWithRefresh,
}