import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator"
import authChecker from "../middleware/auth"
import { decode } from "querystring";
const authService = require("../services/authService");
const router = express.Router();
const createError = require('http-errors');
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const { upload } = require ("../middleware/upload");
const userService = require("../services/userService");
const categoryService = require("../services/categoryService");
const reviewService = require("../services/reviewService");

/**
 *  @route Post user/login
 *  @desc Authenticate user & get token(로그인)
 *  @access Public
 */
router.post(
    "/login",
    [
        check("email", "Please include a valid email").not().isEmpty(),
        check("password", "password is required").not().isEmpty(),
    ],
    async(req: Request, res: Response, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return next(createError(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }

        const {email, password} = req.body;

        try {
            const user = await userService.loginUser(email, password);
            const userToken = await authService.generateToken(user._id);

            return res.status(statusCode.OK).json({
                message: responseMessage.SIGN_IN_SUCCESS,
                loginData: {
                    nickname: user.nickname,
                    token_access: userToken,
                    token_refresh: user.token_refresh
                },
            });
        } catch (error) {
            return next(error);
        }
    }
);

/**
 *  @route Post user/signup
 *  @desc generate user(회원가입)
 *  @access Public
 */
router.post(
    "/signup",
    [
        check("nickname", "nickname is required").not().isEmpty(),
        check("password", "password is required").not().isEmpty(),
    ],
    async(req: Request, res: Response, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return next(createError(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }

        const {nickname, email, password} = req.body;

        try {
            await userService.signupUser(nickname, email, password);

            return res.status(statusCode.CREATED).json({
                message: responseMessage.SIGN_UP_SUCCESS
            });

        } catch (error) {
            return next(error);
        }
    }
);

/**
 *  @route Post user/emailAuth
 *  @desc 비밀번호 변경을 위해 이메일로 인증번호 전송
 *  @access Public
 */
 router.post(
    "/emailAuth",
    [
        check("email", "email is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
    ],
    async(req: Request, res: Response, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return next(createError(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }

        const {email} = req.body;

        try {
            const authNum = await userService.mailToUser(email);

            return res.status(statusCode.OK).json({
                message: responseMessage.MAIL_SEND_SUCCESS,
                auth: authNum
            });

        } catch (error) {
            return next(error);
        }
    }
);

/**
 *  @route Put user/changePassword
 *  @desc 비밀번호 변경
 *  @access Public
 */
 router.put(
    "/changePassword",
    [
        check("email", "email is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check("password", "password is required").not().isEmpty(),
    ],
    async(req: Request, res: Response, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return next(createError(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }

        const {email, password} = req.body;

        try {
            await userService.updatePassword(email, password);

            return res.status(statusCode.OK).json({
                message: responseMessage.CHANGE_PW_SUCCESS,
            });

        } catch (error) {
            return next(error);
        }
    }
);

/**
 *  @route Get user/categoryList
 *  @desc fetch my category list(내 카테고리-마이페이지)
 *  @access Private
 */
 router.get(
    "/categoryList",
    authChecker
    ,
    async(req: Request, res: Response, next) => {
        const userId = res.locals.userId
        const cafeId = req.query.cafe;
        
        if (cafeId) 
            if (!mongoose.isValidObjectId(cafeId)){
            return next(createError(statusCode.BAD_REQUEST,responseMessage.INVALID_IDENTIFIER));
        }

        try {
            const myCategoryList = await categoryService.fetchMyCategory(userId, cafeId);
            return res.status(statusCode.OK).json({
                message: responseMessage.READ_MY_CATEGORY_SUCCESS,
                myCategoryList: myCategoryList
            });

        } catch (error) {
            return next(error);
        }
    }
);

/**
 *  @route Get user/myInfo
 *  @desc fetch my Info(내 정보 조회)
 *  @access Private
 */
 router.get(
    "/myInfo",
    authChecker
    ,
    async(req: Request, res: Response, next) => {
        const userId = res.locals.userId
        try {
            const userInfo = await userService.fetchUserInfo(userId);
            return res.status(statusCode.OK).json({
                message: responseMessage.READ_USERINFO_SUCCESS,
                myInfo: {
                    cafeti: userInfo.user.cafeti,
                    nickname: userInfo.user.nickname,
                    email: userInfo.user.email,
                    profileImg: userInfo.user.profileImg,
                    reviewNum: userInfo.reviews,
                    pinNum: userInfo.pins
                }
            });
        } catch (error) {
            return next(error);
        }
    }
);

/**
 *  @route Get user/reviews
 *  @desc get my review list
 *  @access Private
 */
router.get(
    "/reviews",
    authChecker,
    async(req: Request, res: Response, next) => {
        const userId = res.locals.userId
        try {
            const myReviewList = await reviewService.getMyReviews(userId);
            if (!myReviewList) return res.status(statusCode.NO_CONTENT).send();
            return res.status(statusCode.OK).json({
                message: responseMessage.READ_MY_REVIEW_SUCCESS,
                reviews: myReviewList
            });
        } catch (error) {
            return next(error);
        }
    }
);


/**
 *  @route Put user/myInfo
 *  @desc update myInfo
 *  @access Private
 */
 router.put(
     "/myInfo",
    authChecker,
    upload.single('profileImg'),
    async(req: Request, res: Response, next) => {
        const userId = res.locals.userId;
        const { nickname } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty() || !req.file || !nickname){
            return next(createError(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }
        
        const url = req.file;

        try {
            await userService.updateUserInfo(userId, url, nickname);
            return res.status(statusCode.OK).json({
                message: responseMessage.UPDATE_USER_SUCCESS,
            });
        } catch (error) {
            return next(error);
        }
    }
);

/**
 *  @route Get user/refresh/:token
 *  @desc regenerate access token
 *  @access Private
 */
 router.post(
    "/refresh",
    async(req: Request, res: Response, next) => {
        const { token_access, token_refresh } = req.body;
        try {
            const tokens = await authService.generateTokenWithRefresh(token_access, token_refresh);

            return res.status(statusCode.OK).json({
                message: responseMessage.SUCCESS_TOKEN,
                tokens
            });
        } catch (error) {
            return next(error);
        }
    }
);

module.exports = router;