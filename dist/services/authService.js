"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const createError = require('http-errors');
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (err) {
        switch (err.name) {
            // 토큰 유효기간만 지난경우
            case 'TokenExpiredError':
                return undefined;
            // 토큰 형태가 아닌경우 조작된 경우
            case 'JsonWebTokenError':
                return null;
        }
    }
});
const parseJwt = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let base64Url = token.split('.')[1]; // token you get
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        let decodedData = JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
        return decodedData;
    }
    catch (err) {
        return null;
    }
});
const generateToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Return jsonwebtoken
    const token = jsonwebtoken_1.default.sign({ sub: userId }, config_1.default.jwtSecret, { expiresIn: '1d' });
    return token;
});
const generateRefreshToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Return jsonwebtoken
    const token = jsonwebtoken_1.default.sign({ sub: userId }, config_1.default.jwtSecret, { expiresIn: '30d' });
    const user = yield User_1.default.findOneAndUpdate({
        _id: userId
    }, {
        $set: { token_refresh: token }
    }, {
        new: true,
        upsert: true,
        useFindAndModify: false
    });
    return user;
});
const generateTokenWithRefresh = (token_access, token_refresh) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield verifyToken(token_access);
    const refreshToken = yield verifyToken(token_refresh);
    // 토큰 형식이 이상하다면 재발급 거부
    if ((accessToken === null) || (refreshToken === null)) {
        throw createError(statusCode.UNAUTHORIZED, responseMessage.INVALID_TOKEN);
    }
    // 엑세스, 리프레시 둘 다 만료되었다면 다시 로그인해야함
    if ((accessToken === undefined) && (refreshToken === undefined)) {
        // 엑세스, 리프레시 둘 다 만료되었다면 다시 로그인해야함
        throw createError(statusCode.UNAUTHORIZED, responseMessage.NO_REGEN_TOKEN);
        // 문제없다면 토큰 재발급
    }
    else if (refreshToken != undefined) {
        const user = yield User_1.default.findOne({ token_refresh });
        // 없는 유저
        if (!user) {
            throw createError(statusCode.NOT_FOUND, responseMessage.READ_USER_FAIL);
        }
        const token_access = yield generateToken(user._id);
        // 리프레시 토큰의 유효기간이 7일 미만이라면 리프레시 토큰도 재발급
        const decodedPayload = yield parseJwt(token_refresh);
        if ((decodedPayload.exp) - Math.floor(Date.now() / 1000) <= 604800) {
            const refresh = yield generateRefreshToken(user._id);
            return {
                "token_access": token_access,
                "token_refresh": refresh.token_refresh
            };
        }
        return {
            "token_access": token_access,
        };
    }
});
module.exports = {
    generateToken,
    generateRefreshToken,
    generateTokenWithRefresh,
};
//# sourceMappingURL=authService.js.map