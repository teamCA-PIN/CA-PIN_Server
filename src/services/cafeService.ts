import Cafe from "../models/Cafe";
import createError from "http-errors";
import { ICafeAllDTO, ICafeLocationDTO, ICafeSearchDTO } from "../interfaces/ICafe";
import { IMyCafeCategoryDTO } from "../interfaces/ICategory";
import mongoose from "mongoose";
import Tag from "../models/Tag";
import Category from "../models/Category";
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");

const getCafeLocationList = async (tags) => {
    const tag_ids = await Tag.find({
        'tagIdx': { $in: tags
        }
    }).select('_id');
    if (tags.length != tag_ids.length){
        throw createError(statusCode.BAD_REQUEST,responseMessage.INVALID_IDENTIFIER);
    }
    let tagList: mongoose.Types.ObjectId[]= []
    for (let tag of tag_ids){
        tagList.push(tag._id);
    }
    var cafes;
    //태그로 필터된 카페 리스트 조회
    if (tagList.length != 0){
        cafes = await Cafe.find().where('tags').all(tagList).select("_id latitude longitude");
    }
    //쿼리에 태그 정보가 없으면 전체 카페 리스트 조회
    else{
        cafes = await Cafe.find().select("_id latitude longitude");
    }
    let cafeLocationList: ICafeLocationDTO[] = []

    for (let cafe of cafes){
        let location: ICafeLocationDTO = {
            _id: cafe._id,
            latitude: cafe.latitude,
            longitude: cafe.longitude
        }
        cafeLocationList.push(location)
    }
    if (cafeLocationList.length == 0){
        return null;
    }
    return cafeLocationList;
}

const getMyMapCafeList = async(userId,tags) => {
    const tag_ids = await Tag.find({
        'tagIdx': { $in: tags
        }
    }).select('_id');
    if (tags.length != tag_ids.length){
        throw createError(statusCode.BAD_REQUEST,responseMessage.INVALID_IDENTIFIER);
    }
    let tagList: mongoose.Types.ObjectId[]= []
    for (let tag of tag_ids){
        tagList.push(tag._id);
    }
    var mycafeList = []
    //쿼리에 태그 정보가 없으면 전체 카페 리스트 조회
    if (tagList.length != 0){
        mycafeList = await Category.find({user: userId}).populate({
            path:'cafes',
            match: { tags : { $all : tagList}},
            select: "longitude latitude"
        }).select("cafes color name");

    }
    //태그로 필터된 카페 리스트 조회
    else{
        mycafeList = await Category.find({user: userId}).populate({
            path:'cafes',
            select: 'longitude latitude',
            populate:{
                path:"tags"
            }
        }).select("cafes color name");
    }
    if (!mycafeList) {
        throw createError(statusCode.NOT_FOUND,responseMessage.INVALID_IDENTIFIER);
    }
    
    let cafeList: IMyCafeCategoryDTO[] = []
    for (let item of mycafeList) {
        // 카테고리에 카페가 1개 이상 있을 때만 push
        if (item.cafes.length > 0) {
            let info: IMyCafeCategoryDTO = {
                cafes: item.cafes,
                color: item.color,
                name: item.name
            }
            cafeList.push(info);
        }
    }
    if (cafeList.length == 0) return null;

    return cafeList
}

const getCafeDetail = async(cafeId) => {
    const detail = await Cafe.findById(cafeId).populate('tags');

    if (!detail){
        return null;
    }
    return detail;

}

const getNoCoordCafes = async() => {
    const cafes = await Cafe.find().or([{latitude: {$exists : false}},{longitude: {$exists : false}}]);
    if (cafes.length == 0) return null;
    return cafes;
}

const saveCoord = async(cafe) => {
    await cafe.save();
    return;
}

const isCafeExists = async(cafeId) => {
    const cafe = await Cafe.findById(cafeId)
    if (!cafe) return false
    return true
}

const updateCafeImage = async(cafeId,url) => {
    const cafe = await Cafe.findById(cafeId)
    if (!cafe) return null
    cafe.img = url
    await cafe.save()
    return cafe
}

const getCafeByName = async(query) => {
    const cafes = await Cafe.find({ name: { $regex: `^${query}`, $options: "i" } });
    if (cafes.length == 0) return null
    const cafeSearchDTOs: ICafeSearchDTO[] = []
    for (let cafe of cafes){
        const cafeSearchDTO: ICafeSearchDTO = {
            _id: cafe._id,
            name: cafe.name,
            address: cafe.address,
            latitude: cafe.latitude,
            longitude: cafe.longitude,
            img: cafe.img
        }
        cafeSearchDTOs.push(cafeSearchDTO)
    }
    return cafeSearchDTOs
}

const getCafeAllList = async (tags) => {
    const tag_ids = await Tag.find({
        'tagIdx': { $in: tags
        }
    }).select('_id');
    if (tags.length != tag_ids.length){
        throw createError(statusCode.BAD_REQUEST,responseMessage.INVALID_IDENTIFIER);
    }
    let tagList: mongoose.Types.ObjectId[]= []
    for (let tag of tag_ids){
        tagList.push(tag._id);
    }
    var cafes;
    //태그로 필터된 카페 리스트 조회
    if (tagList.length != 0){
        cafes = await Cafe.find().where('tags').all(tagList).populate("tags");
    }
    //쿼리에 태그 정보가 없으면 전체 카페 리스트 조회
    else{
        cafes = await Cafe.find().populate("tags");
    }
    let cafeLocationList: ICafeAllDTO[] = []

    for (let cafe of cafes){
        let location: ICafeAllDTO = {
            _id: cafe._id,
            name: cafe.name,
            latitude: cafe.latitude,
            longitude: cafe.longitude,
            address: cafe.address,
            tags: cafe.tags,
            rating: cafe.rating
        }
        cafeLocationList.push(location)
    }
    if (cafeLocationList.length == 0){
        return null;
    }
    return cafeLocationList;
}

const getMyMapCafeAllList = async (userId,tags) => {
    const tag_ids = await Tag.find({
        'tagIdx': { $in: tags
        }
    }).select('_id');
    if (tags.length != tag_ids.length){
        throw createError(statusCode.BAD_REQUEST,responseMessage.INVALID_IDENTIFIER);
    }
    let tagList: mongoose.Types.ObjectId[]= []
    for (let tag of tag_ids){
        tagList.push(tag._id);
    }
    var mycafeList = []
    //쿼리에 태그 정보가 없으면 전체 카페 리스트 조회
    if (tagList.length != 0){
        mycafeList = await Category.find({user: userId}).populate({
            path:'cafes',
            match: { tags : { $all : tagList}},
            select: "longitude latitude name address rating img",
            populate:{
                path: "tags"
            }
        }).select("cafes color name");

    }
    //태그로 필터된 카페 리스트 조회
    else{
        mycafeList = await Category.find({user: userId}).populate({
            path:'cafes',
            select: 'longitude latitude name address rating img',
            populate:{
                path:"tags"
            }
        }).select("cafes color name");
    }

    let cafeList: IMyCafeCategoryDTO[] = []
    for (let item of mycafeList) {
        // 카테고리에 카페가 1개 이상 있을 때만 push
        if (item.cafes.length > 0) {
            let info: IMyCafeCategoryDTO = {
                cafes: item.cafes,
                color: item.color,
                name: item.name
            }
            cafeList.push(info);
        }
    }
    if (cafeList.length == 0) return null;
    return cafeList
}

module.exports = {
    getCafeLocationList,
    getMyMapCafeList,
    getCafeDetail,
    getNoCoordCafes,
    saveCoord,
    isCafeExists,
    updateCafeImage,
    getCafeByName,
    getCafeAllList,
    getMyMapCafeAllList
}
   
