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
const cafeService = require("../services/cafeService");
const categoryService = require("../services/categoryService");
const responseMessage = require("../modules/responseMessage");
const reviewService = require("../services/reviewService");
const router = express_1.default.Router();
const statusCode = require("../modules/statusCode");
/**
 *  @route GET cafes?tags={tagIndex},..,{}
 *  @desc get a cafe location list
 *  @access Public
 */
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tagQuery = req.query.tags;
    var tags = [];
    try {
        if (tagQuery) {
            tags = tagQuery.split(",").map(x => +x);
        }
        const cafeLocationList = yield cafeService.getCafeLocationList(tags);
        if (!cafeLocationList)
            res.status(statusCode.NO_CONTENT).send();
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
router.get("/:cafeId", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            var average = yield reviewService.getCafeAverageRating(cafeId);
            if (!average)
                return res.status(statusCode.OK).send({ message: responseMessage.CAFE_DETAIL_SUCCESS, cafeDetail, isSaved });
            average = Number(average.toFixed(1));
            return res.status(statusCode.OK).send({ message: responseMessage.CAFE_DETAIL_SUCCESS, cafeDetail, isSaved, average });
        }
    }
    catch (error) {
        return next(error);
    }
}));
module.exports = router;
//# sourceMappingURL=cafes.js.map