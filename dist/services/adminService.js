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
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const authService = require("../services/authService");
const createError = require('http-errors');
const nd = require("../modules/dateCalculate");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const loginAdmin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield User_1.default.findOne({ email });
    // 없는 유저
    if (!user) {
        throw createError(statusCode.NOT_FOUND, responseMessage.NO_EMAIL);
    }
    // 비밀번호 불일치
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        throw createError(statusCode.BAD_REQUEST, responseMessage.MISS_MATCH_PW);
    }
    if (user.is_admin === undefined || user.is_admin == false) {
        throw createError(statusCode.UNAUTHORIZED, responseMessage.UNAUTHORIZED);
    }
    user = yield authService.generateRefreshToken(user._id);
    return user;
});
module.exports = {
    loginAdmin
};
//# sourceMappingURL=adminService.js.map