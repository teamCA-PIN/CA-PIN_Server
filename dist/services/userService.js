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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const Category_1 = __importDefault(require("../models/Category"));
const Review_1 = __importDefault(require("../models/Review"));
const auth = require("../middleware/auth");
const authService = require("../services/authService");
const createError = require('http-errors');
const statusCode = require("../modules/statusCode");
const categoryService = require("../services/categoryService");
const responseMessage = require("../modules/responseMessage");
const nd = require("../modules/dateCalculate");
const nodemailer = require('nodemailer');
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
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
    user = yield authService.generateRefreshToken(user._id);
    return user;
});
const signupUser = (nickname, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // email, password, nickname으로 유저 생성
    // 이메일 중복 확인
    const alreadyEmail = yield User_1.default.findOne({ email });
    // 닉네임 중복 확인
    const alreadyNickname = yield User_1.default.findOne({ nickname });
    var emailReg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    var nicknameReg = /^[\wㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$/;
    if (alreadyNickname != null) {
        throw createError(statusCode.BAD_REQUEST, responseMessage.ALREADY_NICKNAME);
    }
    else if (alreadyEmail != null) {
        throw createError(statusCode.BAD_REQUEST, responseMessage.ALREADY_EMAIL);
    }
    else if (!nicknameReg.test(nickname)) {
        throw createError(statusCode.BAD_REQUEST, responseMessage.NOT_VALID_NICKNAME);
    }
    else if (!emailReg.test(email)) {
        throw createError(statusCode.BAD_REQUEST, responseMessage.NOT_VALID_EMAIL);
    }
    let created_at = nd.getDate();
    const user = new User_1.default({
        email,
        password,
        nickname,
        created_at
    });
    // Encrypt password
    const salt = yield bcryptjs_1.default.genSalt(10);
    user.password = yield bcryptjs_1.default.hash(password, salt);
    yield user.save();
    // 기본 카테고리 생성
    const newbi = yield User_1.default.findOne({ email });
    categoryService.createCategory(newbi._id, 0, "기본 카테고리", true);
    return user;
});
const mailToUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email: email });
    if (!user) {
        throw createError(statusCode.NOT_FOUND, responseMessage.NO_EMAIL);
    }
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_ADMIN,
            pass: process.env.NODEMAILER_PASS
        },
    });
    const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    yield transporter.sendMail({
        from: `"CA:PIN" <${process.env.NODEMAILER_ADMIN}>`,
        to: user.email,
        subject: 'CA:PIN 비밀번호 인증 메일입니다.',
        text: "앱으로 돌아가서 인증코드를 입력해주세요!",
        html: `앱으로 돌아가서 인증코드를 입력해주세요!</br> 인증코드: <b>${verifyCode}</b`,
    });
    return verifyCode;
});
const updatePassword = (email, new_password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email: email });
    if (!user) {
        throw createError(statusCode.NOT_FOUND, responseMessage.NO_EMAIL);
    }
    // Encrypt password
    const salt = yield bcryptjs_1.default.genSalt(10);
    const newPassword = yield bcryptjs_1.default.hash(new_password, salt);
    yield User_1.default.findOneAndUpdate({
        email: email
    }, {
        password: newPassword,
    }, {
        useFindAndModify: false
    });
});
const fetchUserInfo = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // userInfo
    const user = yield User_1.default.findOne({ _id: userId }).select("_id nickname email cafeti profileImg");
    if (!user) {
        throw createError(statusCode.NOT_FOUND, responseMessage.READ_USER_FAIL);
    }
    // User's Review number
    const reviews = (yield Review_1.default.find({ user: userId })).length;
    // User's Pin number
    let pins = 0;
    const categories = (yield Category_1.default.find({ user: userId })).forEach(category => {
        pins += category.cafes.length;
    });
    return { user, reviews, pins };
});
const updateUserInfo = (userId, new_Img, new_nickname) => __awaiter(void 0, void 0, void 0, function* () {
    // userInfo
    const user = yield User_1.default.findOne({ _id: userId }).select("_id nickname email cafeti profileImg");
    if (!user) {
        throw createError(statusCode.NOT_FOUND, responseMessage.READ_USER_FAIL);
    }
    // 닉네임 중복 확인
    if (user.nickname != new_nickname) {
        const alreadyNickname = yield User_1.default.findOne({ nickname: new_nickname });
        var nicknameReg = /^[\wㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$/;
        if (alreadyNickname != null) {
            throw createError(statusCode.BAD_REQUEST, responseMessage.ALREADY_NICKNAME);
        }
        else if (!nicknameReg.test(new_nickname)) {
            throw createError(statusCode.BAD_REQUEST, responseMessage.NOT_VALID_NICKNAME);
        }
    }
    // Update User's Info
    yield User_1.default.findOneAndUpdate({
        _id: userId
    }, {
        profileImg: new_Img.location,
        nickname: new_nickname
    }, {
        new: true,
        useFindAndModify: false
    });
});
module.exports = {
    loginUser,
    signupUser,
    fetchUserInfo,
    updateUserInfo,
    mailToUser,
    updatePassword
};
//# sourceMappingURL=userService.js.map