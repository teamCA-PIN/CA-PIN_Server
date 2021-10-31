"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const http_errors_1 = __importDefault(require("http-errors"));
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
exports.default = (req, res, next) => {
    // Get token from header
    const token = req.header("token");
    // Check if not token
    if (!token) {
        next(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.NO_TOKEN));
    }
    // Verify token
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        res.locals.tokenValue = token;
        res.locals.userId = decoded.sub;
        next();
    }
    catch (err) {
        switch (err.name) {
            case 'TokenExpiredError':
                next(http_errors_1.default(statusCode.UNAUTHORIZED, responseMessage.EXPIRED_TOKEN));
                break;
            case 'JsonWebTokenError':
                next(http_errors_1.default(statusCode.UNAUTHORIZED, responseMessage.INVALID_TOKEN));
                break;
        }
    }
};
//# sourceMappingURL=auth.js.map