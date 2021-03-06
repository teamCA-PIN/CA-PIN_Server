import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator"
import authChecker from "../middleware/auth"
const router = express.Router();
const createError = require('http-errors');
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const categoryService = require("../services/categoryService");



/**
 *  @route Post category/
 *  @desc generate category(카테고리 생성)
 *  @access Private
 */
router.post(
    "/",
    [
        check("colorIdx", "color_id is required").not().isEmpty(),
        check("categoryName", "color_name is required").not().isEmpty(),
    ],
    authChecker,
    async(req: Request, res: Response, next) => {
        const userId = res.locals.userId
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return next(createError(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }

        const {colorIdx, categoryName} = req.body;

        try {
            await categoryService.createCategory(userId, colorIdx, categoryName, false);  
            return res.status(statusCode.CREATED).json({
                message: responseMessage.CREATE_CATEGORY_SUCCESS
            });
        } catch (error) {
            return next(error);
        }
    }
);

/**
 *  @route Put category/:categoryId/
 *  @desc edit category info(카테고리 정보 수정)
 *  @access Private
 */
 router.put(
    "/:categoryId/",
    [
        check("colorIdx", "color_id is required").not().isEmpty(),
        check("categoryName", "color_name is required").not().isEmpty(),
    ],
    authChecker,
    async(req: Request, res: Response, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return next(createError(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }

        const categoryId = req.params.categoryId;
        const {colorIdx, categoryName} = req.body;

        try {
            await categoryService.editCategoryInfo(categoryId, colorIdx, categoryName);  
            return res.status(statusCode.OK).json({
                message: responseMessage.EDIT_CATEGORY_SUCCESS
            });
        } catch (error) {
            return next(error);
        }
    }
);

/**
 *  @route Post /category/:cafeId/archive
 *  @desc pin,unpin cafes in category(카테고리에 카페 넣기,빼기,변경하기)
 *  @access Private
 */
 router.post(
    "/:cafeId/archive",
    authChecker,
    async(req: Request, res: Response, next) => {
        const userId = res.locals.userId;
        const cafeId = req.params.cafeId;
        const { categoryId } = req.body;
        try {
            if (!mongoose.isValidObjectId(cafeId)){
                return next(createError(statusCode.NOT_FOUND,responseMessage.INVALID_IDENTIFIER));
            }

            await categoryService.storeCafe(userId, categoryId, cafeId);  
            return res.status(statusCode.OK).json({
                message: responseMessage.ADD_PIN_SUCCESS
            });
        } catch (error) {
            return next(error);
        }
    }
);

/**
 *  @route Delete /category/:categoryId/archive
 *  @desc delete cafes in category(카테고리에 있는 카페 삭제)
 *  @access Private
 */
 router.delete(
    "/:categoryId/archive",
    [
        check("cafeList", "cafeList is required").not().isEmpty(),
    ],
    authChecker,
    async(req: Request, res: Response, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return next(createError(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }

        const categoryId = req.params.categoryId;
        const {cafeList} = req.body;

        try {
            if (!mongoose.isValidObjectId(categoryId)){
                return next(createError(statusCode.BAD_REQUEST,responseMessage.INVALID_IDENTIFIER));
            }

            await categoryService.deleteCafesinCategory(categoryId, cafeList);  
            return res.status(statusCode.OK).json({
                message: responseMessage.DELETE_CAFES_IN_CATEGORY_SUCCESS
            });
        } catch (error) {
            return next(error);
        }
    }
);

/**
 *  @route Delete category/:categoryId
 *  @desc delete category(카테고리 삭제)
 *  @access Private
 */
 router.delete(
    "/:categoryId",
    authChecker,
    async(req: Request, res: Response, next) => {
        const categoryId = req.params.categoryId;
        try {
            if (!mongoose.isValidObjectId(categoryId)){
                return next(createError(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER));
            }
            
            await categoryService.deleteCategory(categoryId);
            return res.status(statusCode.OK).json({
                message: responseMessage.DELETE_CATEGORY_SUCCESS
            });
        } catch (error) {
            return next(error);
        }
    }
);

/**
 *  @route Get category/:categoryId/cafes
 *  @desc fetch cafes in category(카테고리에 핀된 카페들 모아보기)
 *  @access Private
 */
 router.get(
    "/:categoryId/cafes",
    authChecker
    ,
    async(req: Request, res: Response, next) => {
        const categoryId = req.params.categoryId;
        try {
            if (!mongoose.isValidObjectId(categoryId)){
                return next(createError(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER));
            }

            const cafeList = await categoryService.fetchCafesInCategory(categoryId, res.locals.userId);
            return res.status(statusCode.OK).json({
                message: responseMessage.READ_CATEGORY_CAFE_SUCCESS,
                cafeDetail: cafeList
            });
        } catch (error) {
            return next(error);
        }
    }
);


module.exports = router;