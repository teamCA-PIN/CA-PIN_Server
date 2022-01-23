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
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const adminService = require("../services/adminService");
const authService = require("../services/authService");
const cafeService = require("../services/cafeService");
const reviewService = require("../services/reviewService");
const { upload } = require("../middleware/upload");
const config_1 = __importDefault(require("../config"));
const geocoderService = require("../services/geocoderService");
router.put("/cafes/:cafeId/image", upload.single("img"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const adminKey = config_1.default.adminSecretKey;
    if (!req.header || !req.file) {
        return next(http_errors_1.default(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE)));
    }
    if (req.header("adminKey") != adminKey) {
        return next(http_errors_1.default(http_errors_1.default(statusCode.UNAUTHORIZED, responseMessage.UNAUTHORIZED)));
    }
    const cafeId = req.params.cafeId;
    if (!cafeId)
        return next(http_errors_1.default(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.OUT_OF_VALUE)));
    const cafe = yield cafeService.updateCafeImage(cafeId, req.file.location);
    if (!cafe)
        return res.status(statusCode.NO_CONTENT).send();
    return res.status(statusCode.OK).json({
        message: "카페 이미지 업로드 성공"
    });
}));
router.put("/geocoder", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const adminKey = config_1.default.adminSecretKey;
    if (req.header("adminKey") != adminKey) {
        return next(http_errors_1.default(http_errors_1.default(statusCode.UNAUTHORIZED, responseMessage.UNAUTHORIZED)));
    }
    const cafeId = req.query.cafe;
    try {
        var cafes = [];
        //쿼리로 카페 id가 들어오는 경우
        if (cafeId) {
            const cafe = yield cafeService.getCafeDetail(cafeId);
            cafes.push(cafe);
        }
        //전체 카페 데이터에 좌표가 없는 경우를 찾음
        else {
            cafes = yield cafeService.getNoCoordCafes();
        }
        //좌표가 없는 카페가 없다.
        var cnt = 0;
        if (!cafes)
            return res.status(204).send();
        for (let cafe of cafes) {
            const address = cafe.address;
            if (!address)
                return next(http_errors_1.default(400, "카페 주소가 없습니다."));
            const coord = yield geocoderService.requestGeocoding(address);
            if (!coord)
                return next(http_errors_1.default(400, "좌표 변환에 실패했습니다."));
            cafe.latitude = coord.y;
            cafe.longitude = coord.x;
            yield cafeService.saveCoord(cafe);
            cnt++;
        }
        return res.status(statusCode.OK).json({ message: `${cnt}개의 좌표 전환 성공` });
    }
    catch (error) {
        if (error.response.status)
            return next(http_errors_1.default(error.response.status, error.message));
        return next(http_errors_1.default(error));
    }
}));
router.post("/login", [
    express_validator_1.check("email", "Please include a valid email").not().isEmpty(),
    express_validator_1.check("password", "password is required").not().isEmpty(),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return next(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    const { email, password } = req.body;
    try {
        const user = yield adminService.loginAdmin(email, password);
        const userToken = yield authService.generateToken(user._id);
        return res.status(statusCode.OK).json({
            message: responseMessage.SIGN_IN_SUCCESS,
            loginData: {
                nickname: user.nickname,
                token_access: userToken,
                token_refresh: user.token_refresh
            },
        });
    }
    catch (error) {
        return next(error);
    }
}));
router.post("/reset/review", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const adminKey = config_1.default.adminSecretKey;
    if (req.header("adminKey") != adminKey) {
        return next(http_errors_1.default(http_errors_1.default(statusCode.UNAUTHORIZED, responseMessage.UNAUTHORIZED)));
    }
    try {
        const cafes = yield cafeService.getCafeLocationList([]);
        for (let cafe of cafes) {
            reviewService.updateCafeAverageRating(cafe._id.toString());
        }
        return res.status(statusCode.OK).json();
    }
    catch (error) {
        return next(error);
    }
}));
module.exports = router;
//# sourceMappingURL=admin.js.map