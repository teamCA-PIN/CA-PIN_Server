import User from "../models/User";
import bcrypt from "bcryptjs";
const authService = require("../services/authService");
const createError = require('http-errors');
const nd = require("../modules/dateCalculate");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");

const loginAdmin = async(email, password) => {
    let user = await User.findOne({ admin_email: email });

    // 없는 유저
    if (!user) {
        throw createError(statusCode.NOT_FOUND,responseMessage.NO_EMAIL);
    }

    // 비밀번호 불일치
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw createError(statusCode.BAD_REQUEST,responseMessage.MISS_MATCH_PW);
    }
    if (user.is_admin === undefined) {
        throw createError(statusCode.UNAUTHORIZED, responseMessage.UNAUTHORIZED);
    }

    user = await authService.generateRefreshToken(user._id);

    return user
};

module.exports = {
    loginAdmin
}