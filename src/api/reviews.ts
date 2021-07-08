import express, { Request, Response } from "express";
import mongoose from "mongoose";
const router = express.Router();
const reviewService = require("../services/reviewService");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
import auth from "../middleware/auth";
import createError from "http-errors";
import { FileSystemCredentials } from "aws-sdk";
const { upload } = require ("../middleware/upload");

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
        const reviewParams = JSON.parse(req.body.review);
        const cafeId = req.query.cafe;
        const userId = res.locals.userId;
        console.log(userId);
        const {
            content,
            recommend,
            rating
        } = reviewParams;

        if (recommend && !recommend.isArray(Number)) next(createError(createError(statusCode.BAD_REQUEST,responseMessage.OUT_OF_VALUE)));
        if (!content || !rating) next(createError(createError(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE)));
        if (!cafeId || !mongoose.isValidObjectId(cafeId)){
            next(createError(statusCode.BAD_REQUEST,responseMessage.INVALID_IDENTIFIER));
        }
        try{
            var urls = [];
            for (let i=0;i<req.files.length;i++){
                const url = req.files[i].location;
                urls.push(url);
            }
            const isReviewed = await reviewService.checkIfReviewed(cafeId,userId);
            console.log(isReviewed);
            if(isReviewed) next(createError(createError(statusCode.BAD_REQUEST,responseMessage.REPEATED_VALUE)));
            
            const review = await reviewService.createReview(cafeId,userId,content,rating,recommend,urls);
            console.log(review);
            res.status(statusCode.CREATED).json();
        } catch (error) {
            next(error);
        }


    }
)

module.exports = router;