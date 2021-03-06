import mongoose from "mongoose";
import { ICafeCategoryDTO } from "../interfaces/ICafe";
import { IMyCategoryListDTO } from "../interfaces/ICategory";
import Category from "../models/Category";
import CategoryColor from "../models/CategoryColor";
import User from "../models/User";
import Cafe from "../models/Cafe";
const createError = require('http-errors');
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");

const createCategory = async(userId, colorIdx, categoryName, isDefault) => {
    const hexacode = await CategoryColor.findOne({color_id: colorIdx},{_id:false}).select("color_code");
    const user = await User.findOne({_id: userId}).select("_id");
    const cafeList: mongoose.Types.ObjectId[]= [] 
    
    if (!user) {
        throw createError(statusCode.NOT_FOUND,responseMessage.READ_USER_FAIL);
    } else if (!hexacode) {
        throw createError(statusCode.NOT_FOUND,responseMessage.INVALID_IDENTIFIER);
    }

    const category = new Category({
        cafes: cafeList,
        user: userId,
        color: hexacode.color_code,
        name: categoryName,
        isDefault: isDefault
    });

    await category.save();

    return category;
};

const editCategoryInfo = async(categoryId, color, name) => {
    const category = await Category.findOne({_id: categoryId});
    const hexacode = await CategoryColor.findOne({color_id: color});
    
    if (!category || !hexacode) {
        throw createError(statusCode.NOT_FOUND,responseMessage.INVALID_IDENTIFIER);
    } else if (category.isDefault) {
        throw createError(statusCode.BAD_REQUEST,responseMessage.EDIT_DEFAULT_FAIL);
    }

    await Category.findOneAndUpdate(
        { 
            _id: categoryId 
        },
        { 
            color: hexacode.color_code,
            name: name
        },
        { 
            new: true,
            useFindAndModify: false
        }
    );
}

const deleteCafesinCategory = async(categoryId, cafeList) => {
    const category = await Category.findOne({_id: categoryId});
    // ???????????? ??????????????? ????????? ???????????? ?????? ??????????????? ????????? ???????????? ?????? ??????
    if (!category || ((cafeList.length != cafeList.filter(x => category.cafes.includes(x)).length))) {
        throw createError(statusCode.NOT_FOUND,responseMessage.INVALID_IDENTIFIER);
    }

    for (let cafe of cafeList) {
        if (cafe in category.cafes) {
            throw createError(statusCode.NOT_FOUND,responseMessage.INVALID_IDENTIFIER)
        }
        await Category.findOneAndUpdate(
            { 
                _id: categoryId 
            },
            { 
                $pull: {cafes: cafe}
            },
            { 
                useFindAndModify: false
            }
        );
    }
}

const storeCafe = async(userId, categoryId, cafeId) => {
    const cafe = await Cafe.findOne({_id: cafeId});

    if (!cafe) {
        // id??? ???????????? ??????????????? ?????? ??????
        throw createError(statusCode.NOT_FOUND,responseMessage.INVALID_IDENTIFIER);
    }
    
    // ????????? ????????? ????????? ????????? ???????????? ?????????
    const existList = await Category.find({user: userId}).where('cafes').all([cafeId]);
    
    //????????? ????????? ??????????????? ???????????? ??????
    for (let exist of existList) {
        await deleteCafesinCategory(exist._id, [cafeId]);
    }

    if (categoryId) {
        await Category.updateOne({
            _id: categoryId
          },
          {
            $addToSet: {cafes: [cafe._id]}
          }); 
    }
};

const deleteCategory = async(categoryId) => {
    const category = await Category.findOne({_id: categoryId});
    if (!category) {
        throw createError(statusCode.NOT_FOUND,responseMessage.INVALID_IDENTIFIER);
    } else if (category.isDefault) {
        throw createError(statusCode.BAD_REQUEST,responseMessage.DELETE_DEFAULT_FAIL);
    }

    await Category.remove({_id: category._id}, function(err) {
        if (err) {
            throw err;
        }
    });
}

const fetchMyCategory = async(userId, cafeId) => {
    const categoryList = await Category.find({user: userId}).select("_id cafes color name");
    if (!categoryList) {
        throw createError(statusCode.NOT_FOUND,responseMessage.INVALID_IDENTIFIER);
    }

    if (!cafeId) {
        //cafeId??? ??????????????? ????????????????????? ?????? ?????? ?????? return
        return categoryList
    } else {
        //cafeId??? ??????????????? ?????????????????? cafeId??? ?????? ??????????????? isPin ????????? true??? ?????? ??????
        let savedCategoryList: IMyCategoryListDTO[] = []
        for (let item of categoryList) {
            let content: IMyCategoryListDTO;
            let isPin = false
            for (let cafe of item.cafes) {
                if (cafe.toString() == cafeId.toString()) {
                    isPin = true
                } 
            }
            if (isPin) {
                content = {
                    cafes: item.cafes,
                    _id: item._id,
                    color: item.color,
                    name: item.name,
                    isPin: true
                }
            } else {
                content = {
                    cafes: item.cafes,
                    _id: item._id,
                    color: item.color,
                    name: item.name,
                    isPin: false
                }
            }
            savedCategoryList.push(content)
        }
        return savedCategoryList
    }
}

const fetchCafesInCategory = async(categoryId, userId) => {
    const whatCategory = await Category.findById({
        _id: categoryId,
        user: userId
    }).populate({
        path : 'cafes', 
        populate : {path : 'tags', select: 'name'},
        select: '_id tags name address rating'
    });

    if (!whatCategory) {
        throw createError(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER);
    }


    return whatCategory.cafes
}

const checkCafeInCategory = async(cafeId,userId) => {
    const category = await Category.findOne().where('user').equals(userId).findOne({
        'cafes': {
            $all: cafeId
        }
    })
    if (category) return true
    return false
}

module.exports = {
    createCategory,
    editCategoryInfo,
    storeCafe,
    deleteCafesinCategory,
    deleteCategory,
    fetchMyCategory,
    fetchCafesInCategory,
    checkCafeInCategory
}