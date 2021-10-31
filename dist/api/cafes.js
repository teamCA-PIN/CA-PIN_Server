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
const auth_1 = __importDefault(require("../middleware/auth"));
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const cafeService = require("../services/cafeService");
const categoryService = require("../services/categoryService");
const reviewService = require("../services/reviewService");
const menuService = require("../services/menuService");
/**
 *  @route GET cafes?tags={tagIdx}
 *  @desc get a cafe location list
 *  @access Public
 */
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tagQuery = req.query.tags;
    var tags = undefined;
    if (tagQuery) {
        if (tagQuery.length == 1)
            tags = [tagQuery];
        else
            tags = tagQuery.map(x => +x);
    }
    else
        tags = [];
    try {
        const cafeLocationList = yield cafeService.getCafeLocationList(tags);
        if (!cafeLocationList)
            return res.status(statusCode.NO_CONTENT).send();
        return res.status(statusCode.OK).json({
            message: responseMessage.CAFE_LOCATION_SUCCESS,
            cafeLocations: cafeLocationList
        });
    }
    catch (error) {
        next(error);
    }
}));
/**
 *  @route GET cafes/:cafeId
 *  @desc get a cafe detail
 *  @access Private
 */
router.get("/detail/:cafeId", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cafeId = req.params.cafeId;
    const userId = res.locals.userId;
    try {
        if (!mongoose_1.default.isValidObjectId(cafeId)) {
            return next(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.INVALID_IDENTIFIER));
        }
        else {
            const cafeDetail = yield cafeService.getCafeDetail(cafeId);
            if (!cafeDetail)
                return res.status(statusCode.NO_CONTENT).send();
            const isSaved = yield categoryService.checkCafeInCategory(cafeId, userId);
            // var average: Number = await reviewService.getCafeAverageRating(cafeId);
            // if (!average) return res.status(statusCode.OK).send({message:responseMessage.CAFE_DETAIL_SUCCESS,cafeDetail,isSaved})
            // average = Number(average.toFixed(1))
            return res.status(statusCode.OK).send({ message: responseMessage.CAFE_DETAIL_SUCCESS, cafeDetail, isSaved });
        }
    }
    catch (error) {
        return next(error);
    }
}));
/**
 *  @route GET cafes/myMap
 *  @desc get a my map cafe location list
 *  @access Private
 */
router.get("/myMap", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId;
    const tagQuery = req.query.tags;
    var tags = undefined;
    if (tagQuery) {
        if (tagQuery.length == 1)
            tags = [tagQuery];
        else
            tags = tagQuery.map(x => +x);
    }
    else
        tags = [];
    try {
        const myMapList = yield cafeService.getMyMapCafeList(userId, tags);
        if (!myMapList)
            return res.status(statusCode.NO_CONTENT).send();
        return res.status(statusCode.OK).json({
            message: responseMessage.MYMAP_LOCATION_SUCCESS,
            myMapLocations: myMapList
        });
    }
    catch (error) {
        return next(error);
    }
}));
/**
 *  @route GET cafes/myMap
 *  @desc get a my map cafe location and detail list
 *  @access Private
 */
router.get("/myMap/all", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId;
    const tagQuery = req.query.tags;
    var tags = undefined;
    if (tagQuery) {
        if (tagQuery.length == 1)
            tags = [tagQuery];
        else
            tags = tagQuery.map(x => +x);
    }
    else
        tags = [];
    try {
        const myMapList = yield cafeService.getMyMapCafeAllList(userId, tags);
        if (!myMapList)
            return res.status(statusCode.NO_CONTENT).send();
        return res.status(statusCode.OK).json({
            message: responseMessage.MYMAP_LOCATION_SUCCESS,
            myMapLocations: myMapList
        });
    }
    catch (error) {
        return next(error);
    }
}));
/**
 *  @route GET cafes/detail/:cafeId/menus
 *  @desc get a cafe menu list
 *  @access public
 */
router.get("/:cafeId/menus", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cafeId = req.params.cafeId;
    if (!cafeId)
        return (next(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE)));
    if (!mongoose_1.default.isValidObjectId(cafeId))
        return (next(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.INVALID_IDENTIFIER)));
    try {
        const menuList = yield menuService.getCafeMenuList(cafeId);
        if (!menuList)
            return res.status(statusCode.NO_CONTENT).send();
        return res.status(statusCode.OK).json({
            message: responseMessage.CAFE_MENU_SUCCESS,
            menus: menuList
        });
    }
    catch (error) {
        return next(error);
    }
}));
/**
 *  @route GET cafes?tags={tagIdx}
 *  @desc get a cafe location and detail list
 *  @access Public
 */
router.get("/all", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tagQuery = req.query.tags;
    var tags = undefined;
    if (tagQuery) {
        if (tagQuery.length == 1)
            tags = [tagQuery];
        else
            tags = tagQuery.map(x => +x);
    }
    else
        tags = [];
    try {
        const cafeLocationList = yield cafeService.getCafeAllList(tags);
        if (!cafeLocationList)
            return res.status(statusCode.NO_CONTENT).send();
        return res.status(statusCode.OK).json({
            message: responseMessage.CAFE_LOCATION_SUCCESS,
            cafeLocations: cafeLocationList
        });
    }
    catch (error) {
        next(error);
    }
}));
module.exports = router;
//# sourceMappingURL=cafes.js.map