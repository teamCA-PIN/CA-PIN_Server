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
const { upload } = require("../middleware/upload");
const cafeService = require("../services/cafeService");
const reviewService = require("../services/reviewService");
/**
 *  @route GET reviews/:cafeId
 *  @desc get a cafe review list
 *  @access Public
 */
router.get("/", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cafeId = req.query.cafe;
    const userId = res.locals.userId;
    if (!cafeId || !mongoose_1.default.isValidObjectId(cafeId)) {
        next(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.INVALID_IDENTIFIER));
    }
    try {
        const reviews = yield reviewService.getCafeReviewList(cafeId);
        if (reviews.length == 0) {
            res.status(statusCode.NO_CONTENT).json();
            next();
        }
        const isReviewed = yield reviewService.checkIfReviewed(cafeId, userId);
        return res.status(statusCode.OK).json({
            message: responseMessage.READ_CAFE_REVIEW_SUCCESS,
            reviews: reviews,
            isReviewed: isReviewed
        });
    }
    catch (error) {
        next(error);
    }
}));
router.post("/", auth_1.default, upload.array("imgs", 5), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body || !req.body.review)
        return (next(http_errors_1.default(401, responseMessage.NULL_VALUE)));
    const reviewParams = JSON.parse(req.body.review);
    const cafeId = req.query.cafe;
    const userId = res.locals.userId;
    const { content, recommend, rating } = reviewParams;
    if (!content || !rating)
        next(http_errors_1.default(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE)));
    if (!cafeId || !mongoose_1.default.isValidObjectId(cafeId)) {
        return next(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.INVALID_IDENTIFIER));
    }
    if (recommend && (!Array.isArray(recommend) || !(recommend.includes(0) || recommend.includes(1))))
        return next(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.REVIEW_REQUEST_FAIL));
    try {
        var urls = undefined;
        if (req.files.length != 0) {
            urls = [];
            for (let i = 0; i < req.files.length; i++) {
                const url = req.files[i].location;
                urls.push(url);
            }
        }
        const isCafeExists = yield cafeService.isCafeExists(cafeId);
        if (!isCafeExists)
            return res.status(statusCode.NO_CONTENT).send();
        const isReviewed = yield reviewService.checkIfReviewed(cafeId, userId);
        if (isReviewed)
            return next(http_errors_1.default(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.REPEATED_VALUE)));
        const review = yield reviewService.createReview(cafeId, userId, content, rating, recommend, urls);
        res.status(statusCode.CREATED).json();
        return yield reviewService.updateCafeAverageRating(cafeId);
    }
    catch (error) {
        return next(error);
    }
}));
router.put("/:reviewId", auth_1.default, upload.array("imgs", 5), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body || !req.body.review)
        return (next(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE)));
    const reviewParams = JSON.parse(req.body.review);
    const reviewId = req.params.reviewId;
    const userId = res.locals.userId;
    const { content, recommend, rating, isAllDeleted } = reviewParams;
    if (isAllDeleted === undefined || !content || !rating)
        return next(http_errors_1.default(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE)));
    if (!reviewId || !mongoose_1.default.isValidObjectId(reviewId)) {
        next(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.INVALID_IDENTIFIER));
    }
    if (recommend && (!Array.isArray(recommend) || !(recommend.includes(0) || recommend.includes(1))))
        return next(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.REVIEW_REQUEST_FAIL));
    try {
        var urls = undefined;
        if (req.files.length != 0 && !isAllDeleted) {
            urls = [];
            for (let i = 0; i < req.files.length; i++) {
                const url = req.files[i].location;
                urls.push(url);
            }
        }
        const review = yield reviewService.modifyReview(reviewId, userId, content, rating, isAllDeleted, recommend, urls);
        if (!review)
            res.status(statusCode.NO_CONTENT).send();
        res.status(statusCode.OK).json({ message: responseMessage.EDIT_REVIEW_SUCCESS });
        return yield reviewService.updateCafeAverageRating(review.cafe);
    }
    catch (error) {
        console.log(error.statusCode, error.message);
        next(error);
    }
}));
router.delete("/:reviewId", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewId = req.params.reviewId;
    const userId = res.locals.userId;
    if (!reviewId)
        next(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    try {
        const review = yield reviewService.deleteReview(reviewId, userId);
        if (!review)
            res.status(statusCode.NO_CONTENT).send();
        res.status(statusCode.OK).json({ message: responseMessage.DELETE_REVIEW_SUCCESS });
        return yield reviewService.updateCafeAverageRating(review.cafe);
    }
    catch (error) {
        next(error);
    }
}));
router.post("/report/:reviewId", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewId = req.params.reviewId;
    const userId = res.locals.userId;
    if (!reviewId)
        next(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    try {
        const review = yield reviewService.getReviewById(reviewId);
        if (!review) {
            return res.status(statusCode.NO_CONTENT).send();
        }
        if (userId == review.user.id) {
            return next(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.REPORT_REVIEW_FAIL));
        }
        const report = yield reviewService.reportReview(userId, review);
        res.status(statusCode.OK).send();
        return reviewService.mailToAdmin(review, report);
    }
    catch (error) {
        next(error);
    }
}));
module.exports = router;
//# sourceMappingURL=reviews.js.map