import createError from "http-errors";
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator"
const router = express.Router();
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const adminService = require("../services/adminService");
const authService = require("../services/authService");
const cafeService = require("../services/cafeService");
const reviewService = require("../services/reviewService");
const {upload} = require("../middleware/upload");
import config from "../config";
const geocoderService = require("../services/geocoderService");

router.put(
    "/cafes/:cafeId/image",
    upload.single("img"),
    async(req: Request, res: Response, next) => {
        const adminKey = config.adminSecretKey
        if(!req.header || !req.file ){
            return next(createError(createError(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE)));
        }
        if (req.header("adminKey") != adminKey){
            return next(createError(createError(statusCode.UNAUTHORIZED,responseMessage.UNAUTHORIZED)));
        }
        const cafeId = req.params.cafeId
        if (!cafeId) return next(createError(createError(statusCode.BAD_REQUEST,responseMessage.OUT_OF_VALUE)));
        const cafe = await cafeService.updateCafeImage(cafeId,(req.file as any).location)
        if (!cafe) return res.status(statusCode.NO_CONTENT).send();
        return res.status(statusCode.OK).json({
            message:"카페 이미지 업로드 성공"
        })
    }
);

router.put(
    "/geocoder",
    async(req: Request, res: Response, next) => {
        const adminKey = config.adminSecretKey
        if (req.header("adminKey") != adminKey){
            return next(createError(createError(statusCode.UNAUTHORIZED,responseMessage.UNAUTHORIZED)));
        }
        const cafeId = req.query.cafe;
        try {
            var cafes = [];
            //쿼리로 카페 id가 들어오는 경우
            if (cafeId){
                const cafe = await cafeService.getCafeDetail(cafeId);
                cafes.push(cafe);
            }
            //전체 카페 데이터에 좌표가 없는 경우를 찾음
            else{
                cafes = await cafeService.getNoCoordCafes();
            }
            //좌표가 없는 카페가 없다.
            var cnt = 0
            if (!cafes) return res.status(204).send();
            for (let cafe of cafes){
                const address = cafe.address;
                if (!address) return next(createError(400,"카페 주소가 없습니다."));
                const coord = await geocoderService.requestGeocoding(address);
                if (!coord) return next(createError(400,"좌표 변환에 실패했습니다."));
                cafe.latitude = coord.y;
                cafe.longitude = coord.x;
                await cafeService.saveCoord(cafe);
                cnt++;
            }
            
            return res.status(statusCode.OK).json({message:`${cnt}개의 좌표 전환 성공`});
        } catch (error) {
            if (error.response.status) return next(createError(error.response.status,error.message));
            return next(createError(error));
        }
    }
)
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
            const user = await adminService.loginAdmin(email, password);
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
        check('email', 'email is required').isEmail(),
        check("password", "password is required").not().isEmpty(),
    ],
    async(req: Request, res: Response, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return next(createError(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }

        const {email, password} = req.body;

        try {
            await adminService.signupAdmin(email, password);

            return res.status(statusCode.CREATED).json({
                message: responseMessage.SIGN_UP_SUCCESS
            });

        } catch (error) {
            return next(error);
        }
    }
);

router.post(
    "/reset/review",
    async(req: Request, res: Response, next) => {
        try {
            const cafes = await cafeService.getCafeLocationList([]);
            for (let cafe of cafes) {
                reviewService.updateCafeAverageRating(cafe._id.toString());
            }
            return res.status(statusCode.OK).json();
        } catch (error) {
            return next(error);
        }

    }

);
module.exports = router;