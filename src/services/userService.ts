import config from "../config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Category from "../models/Category";
import Review from "../models/Review";
const auth = require("../middleware/auth");
const authService = require("../services/authService");
const createError = require('http-errors');
const statusCode = require("../modules/statusCode");
const categoryService = require("../services/categoryService");
const responseMessage = require("../modules/responseMessage");
const nd = require("../modules/dateCalculate");
const nodemailer = require('nodemailer');

const loginUser = async(email, password) => {
    let user = await User.findOne({ email });

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

const signupUser = async (nickname, email, password) => {
    // email, password, nickname으로 유저 생성
    // 이메일 중복 확인
    const alreadyEmail = await User.findOne({ email });
    // 닉네임 중복 확인
    const alreadyNickname = await User.findOne({nickname});

    var emailReg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    var nicknameReg = /^[\wㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$/;
    
    if (alreadyNickname != null) {
        throw createError(statusCode.BAD_REQUEST,responseMessage.ALREADY_NICKNAME);
    } else if (alreadyEmail != null) {
        throw createError(statusCode.BAD_REQUEST,responseMessage.ALREADY_EMAIL);
    } else if (!nicknameReg.test(nickname)) {
        throw createError(statusCode.BAD_REQUEST,responseMessage.NOT_VALID_NICKNAME);
    } else if (!emailReg.test(email)) {
        throw createError(statusCode.BAD_REQUEST,responseMessage.NOT_VALID_EMAIL);
    }

    let created_at = nd.getDate();
    const user = new User({
        email,
        password,
        nickname,
        created_at
    });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();

    // 기본 카테고리 생성
    const newbi = await User.findOne({ email });
    categoryService.createCategory(newbi._id, 0, "기본 카테고리", true);
    return user;
}

const mailToUser = async(email) => {
    const user = await User.findOne({email: email})
    if (!user) {
        throw createError(statusCode.NOT_FOUND, responseMessage.NO_EMAIL)
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
    await transporter.sendMail({
        from: `"CA:PIN" <${process.env.NODEMAILER_ADMIN}>`,
        to: user.email,
        subject: 'CA:PIN 비밀번호 인증 메일입니다.',
        text: "앱으로 돌아가서 인증코드를 입력해주세요!",
        html: `앱으로 돌아가서 인증코드를 입력해주세요!</br> 인증코드: <b>${verifyCode}</b`,
    });

    return verifyCode
}

const updatePassword = async(email, new_password) => {
    const user = await User.findOne({email: email})
    if (!user) {
        throw createError(statusCode.NOT_FOUND, responseMessage.NO_EMAIL)
    }
    
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(new_password, salt);
    
    await User.findOneAndUpdate(
        { 
            email: email
        },
        { 
            password: newPassword,
        },
        { 
            useFindAndModify: false
        }
    );

}

const fetchUserInfo = async(userId) => {
    // userInfo
    const user = await User.findOne({_id: userId}).select("_id nickname email cafeti profileImg");
    if (!user) {
        throw createError(statusCode.NOT_FOUND, responseMessage.READ_USER_FAIL);
    }
    
    // User's Review number
    const reviews = (await Review.find({user: userId})).length;

    // User's Pin number
    let pins: number = 0;
    const categories = (await Category.find({user: userId})).forEach(category => {
        pins += category.cafes.length;
    });

    return {user, reviews, pins};
}

const updateUserInfo = async(userId, new_Img, new_nickname) => {
    // userInfo
    const user = await User.findOne({_id: userId}).select("_id nickname email cafeti profileImg");
    if (!user) {
        throw createError(statusCode.NOT_FOUND, responseMessage.READ_USER_FAIL);
    }
    // 닉네임 중복 확인
    if (user.nickname != new_nickname) {
        const alreadyNickname = await User.findOne({nickname: new_nickname});
        var nicknameReg = /^[\wㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$/;
        
        if (alreadyNickname != null) {
            throw createError(statusCode.BAD_REQUEST,responseMessage.ALREADY_NICKNAME);
        } else if (!nicknameReg.test(new_nickname)) {
            throw createError(statusCode.BAD_REQUEST,responseMessage.NOT_VALID_NICKNAME);
        }
    }

    // Update User's Info
    await User.findOneAndUpdate(
        { 
            _id: userId 
        },
        { 
            profileImg: new_Img.location,
            nickname: new_nickname
        },
        { 
            new: true,
            useFindAndModify: false
        }
    );
}

const withDrawalUser = async(userId) => {
    try{
        const user = await User.findById(userId);
        if (!user) {
            throw createError(statusCode.NOT_FOUND,responseMessage.READ_USER_FAIL);
        }
        await User.deleteOne({_id: userId});
        await Review.deleteMany({user: userId});
        await Category.deleteMany({user: userId});
        return true;
    } catch (error) {
        throw(error);
    }
}

module.exports = {
    loginUser,
    signupUser,
    fetchUserInfo,
    updateUserInfo,
    mailToUser,
    updatePassword,
    withDrawalUser
}