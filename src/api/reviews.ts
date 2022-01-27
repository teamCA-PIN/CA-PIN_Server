import auth from "../middleware/auth";
import createError from "http-errors";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { check, validationResult } from "express-validator";
const router = express.Router();
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const { upload } = require ("../middleware/upload");
const cafeService = require("../services/cafeService");
const reviewService = require("../services/reviewService");

/**
 *  @route GET reviews/:cafeId
 *  @desc get a cafe review list
 *  @access Public
 */

router.get(
    "/",auth,
    async(req: Request, res: Response,next) => {
        const cafeId = req.query.cafe;
        const userId = res.locals.userId;

        if (!cafeId || !mongoose.isValidObjectId(cafeId)){
            next(createError(statusCode.BAD_REQUEST,responseMessage.INVALID_IDENTIFIER));
        }

        try{
            const reviews = await reviewService.getCafeReviewList(cafeId);
            if (reviews.length == 0){
                res.status(statusCode.NO_CONTENT).json();
                next();
            }
            const isReviewed = await reviewService.checkIfReviewed(cafeId,userId);
            return res.status(statusCode.OK).json({
                message:responseMessage.READ_CAFE_REVIEW_SUCCESS,
                reviews: reviews,
                isReviewed:isReviewed
            });
        } catch (error) {
            next(error);
        }
    }
)

router.post(
    "/",auth,upload.array("imgs",5),
    async(req: Request, res: Response, next) => {
        if(!req.body || !req.body.review) return (next(createError(401,responseMessage.NULL_VALUE)));
        const reviewParams = JSON.parse(req.body.review);
        const cafeId = req.query.cafe;
        const userId = res.locals.userId;
        const {
            content,
            recommend,
            rating
        } = reviewParams;
        
        if (!content || !rating) next(createError(createError(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE)));
        if (!cafeId || !mongoose.isValidObjectId(cafeId)){
            return next(createError(statusCode.BAD_REQUEST,responseMessage.INVALID_IDENTIFIER));
        }
        if (recommend && (!Array.isArray(recommend) || !(recommend.includes(0) || recommend.includes(1))) ) return next(createError(statusCode.BAD_REQUEST,responseMessage.REVIEW_REQUEST_FAIL));
        try{
            var urls = undefined;
            if (req.files.length!=0){
                urls = []
                for (let i=0;i<req.files.length;i++){
                    const url = req.files[i].location;
                    urls.push(url);
                }

            }
            const isCafeExists = await cafeService.isCafeExists(cafeId);
            if (!isCafeExists) return res.status(statusCode.NO_CONTENT).send();
            const isReviewed = await reviewService.checkIfReviewed(cafeId,userId);
            if(isReviewed) return next(createError(createError(statusCode.BAD_REQUEST,responseMessage.REPEATED_VALUE)));
            
            const review = await reviewService.createReview(cafeId,userId,content,rating,recommend,urls);
            res.status(statusCode.CREATED).json();
            return await reviewService.updateCafeAverageRating(cafeId);
        } catch (error) {
            return next(error);
        }


    }
)

router.put(
    "/:reviewId",auth,upload.array("imgs",5),
    async(req: Request, res: Response, next) => {
        if(!req.body || !req.body.review) return (next(createError(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE)));
        const reviewParams = JSON.parse(req.body.review);
        const reviewId = req.params.reviewId;
        const userId = res.locals.userId;
        const {
            content,
            recommend,
            rating,
            isAllDeleted
        } = reviewParams;

        if (isAllDeleted === undefined || !content || !rating) return next(createError(createError(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE)));
        if (!reviewId || !mongoose.isValidObjectId(reviewId)){
            next(createError(statusCode.BAD_REQUEST,responseMessage.INVALID_IDENTIFIER));
        }
        if (recommend && (!Array.isArray(recommend) || !(recommend.includes(0) || recommend.includes(1))) ) return next(createError(statusCode.BAD_REQUEST,responseMessage.REVIEW_REQUEST_FAIL));
        try{
            var urls = undefined;
            if (req.files.length!=0 && !isAllDeleted){
                urls = []
                for (let i=0;i<req.files.length;i++){
                    const url = req.files[i].location;
                    urls.push(url);
                }

            }
            const review = await reviewService.modifyReview(reviewId,userId,content,rating,isAllDeleted,recommend,urls);
            if (!review) res.status(statusCode.NO_CONTENT).send();

            res.status(statusCode.OK).json({message:responseMessage.EDIT_REVIEW_SUCCESS});
            return await reviewService.updateCafeAverageRating(review.cafe);
        } catch (error) {
            console.log(error.statusCode,error.message);
            next(error);
        }


    }
)

router.delete("/:reviewId",auth,
async(req: Request, res: Response, next) => {
    const reviewId = req.params.reviewId
    const userId = res.locals.userId
    if (!reviewId) next(createError(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE));
    try{
        const review = await reviewService.deleteReview(reviewId,userId);
        if (!review) res.status(statusCode.NO_CONTENT).send();
        res.status(statusCode.OK).json({message:responseMessage.DELETE_REVIEW_SUCCESS});
        return await reviewService.updateCafeAverageRating(review.cafe);

    } catch (error){
        next(error);
    }
})

router.post("/report/:reviewId",auth,
async(req: Request, res: Response, next) => {
    const reviewId = req.params.reviewId
    const userId = res.locals.userId
    if (!reviewId) next(createError(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE));
    try {
        const review = await reviewService.getReviewById(reviewId);
        if (!review) {
            return res.status(statusCode.NO_CONTENT).send();
        }
        if (userId == review.user.id) {
            return next(createError(statusCode.BAD_REQUEST, responseMessage.REPORT_REVIEW_FAIL))
        }
        const report = await reviewService.reportReview(userId,review);
        res.status(statusCode.OK).send();
        return reviewService.mailToAdmin(review, report);
    } catch (error) {
        next(error);
    }
})

module.exports = router;