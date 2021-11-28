import AdminUser from "../models/AdminUser";
import bcrypt from "bcryptjs";
const authService = require("../services/authService");
const createError = require('http-errors');
const nd = require("../modules/dateCalculate");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");

const loginAdmin = async(email, password) => {
    let user = await AdminUser.findOne({ email });

    // 없는 유저
    if (!user) {
        throw createError(statusCode.NOT_FOUND,responseMessage.NO_EMAIL);
    }

    // 비밀번호 불일치
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw createError(statusCode.BAD_REQUEST,responseMessage.MISS_MATCH_PW);
    }

    user = await authService.generateRefreshToken(user._id);

    return user
};

const signupAdmin = async (nickname, email, password) => {
    // email, password, nickname으로 유저 생성
    // 이메일 중복 확인
    const alreadyEmail = await AdminUser.findOne({ email });

    var emailReg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    
    if (alreadyEmail != null) {
        throw createError(statusCode.BAD_REQUEST,responseMessage.ALREADY_EMAIL);
    } else if (!emailReg.test(email)) {
        throw createError(statusCode.BAD_REQUEST,responseMessage.NOT_VALID_EMAIL);
    }

    let created_at = nd.getDate();
    const user = new AdminUser({
        email,
        password,
        created_at
    });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();

    return user;
}

module.exports = {
    loginAdmin,
    signupAdmin
}