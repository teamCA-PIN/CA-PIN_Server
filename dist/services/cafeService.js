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
const Cafe_1 = __importDefault(require("../models/Cafe"));
const http_errors_1 = __importDefault(require("http-errors"));
const Tag_1 = __importDefault(require("../models/Tag"));
const Category_1 = __importDefault(require("../models/Category"));
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const getCafeLocationList = (tags) => __awaiter(void 0, void 0, void 0, function* () {
    const tag_ids = yield Tag_1.default.find({
        'tagIdx': { $in: tags
        }
    }).select('_id');
    if (tags.length != tag_ids.length) {
        throw http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.INVALID_IDENTIFIER);
    }
    let tagList = [];
    for (let tag of tag_ids) {
        tagList.push(tag._id);
    }
    var cafes;
    //태그로 필터된 카페 리스트 조회
    if (tagList.length != 0) {
        cafes = yield Cafe_1.default.find().where('tags').all(tagList).select("_id latitude longitude");
    }
    //쿼리에 태그 정보가 없으면 전체 카페 리스트 조회
    else {
        cafes = yield Cafe_1.default.find().select("_id latitude longitude");
    }
    let cafeLocationList = [];
    for (let cafe of cafes) {
        let location = {
            _id: cafe._id,
            latitude: cafe.latitude,
            longitude: cafe.longitude
        };
        cafeLocationList.push(location);
    }
    if (cafeLocationList.length == 0) {
        return null;
    }
    return cafeLocationList;
});
const getMyMapCafeList = (userId, tags) => __awaiter(void 0, void 0, void 0, function* () {
    const tag_ids = yield Tag_1.default.find({
        'tagIdx': { $in: tags
        }
    }).select('_id');
    if (tags.length != tag_ids.length) {
        throw http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.INVALID_IDENTIFIER);
    }
    let tagList = [];
    for (let tag of tag_ids) {
        tagList.push(tag._id);
    }
    var mycafeList = [];
    //쿼리에 태그 정보가 없으면 전체 카페 리스트 조회
    if (tagList.length != 0) {
        mycafeList = yield Category_1.default.find({ user: userId }).populate({
            path: 'cafes',
            match: { tags: { $all: tagList } },
            select: "longitude latitude"
        }).select("cafes color name");
    }
    //태그로 필터된 카페 리스트 조회
    else {
        mycafeList = yield Category_1.default.find({ user: userId }).populate({
            path: 'cafes',
            select: 'longitude latitude',
            populate: {
                path: "tags"
            }
        }).select("cafes color name");
    }
    if (!mycafeList) {
        throw http_errors_1.default(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER);
    }
    let cafeList = [];
    for (let item of mycafeList) {
        // 카테고리에 카페가 1개 이상 있을 때만 push
        if (item.cafes.length > 0) {
            let info = {
                cafes: item.cafes,
                color: item.color,
                name: item.name
            };
            cafeList.push(info);
        }
    }
    if (cafeList.length == 0)
        return null;
    return cafeList;
});
const getCafeDetail = (cafeId) => __awaiter(void 0, void 0, void 0, function* () {
    const detail = yield Cafe_1.default.findById(cafeId).populate('tags');
    if (!detail) {
        return null;
    }
    return detail;
});
const getNoCoordCafes = () => __awaiter(void 0, void 0, void 0, function* () {
    const cafes = yield Cafe_1.default.find().or([{ latitude: { $exists: false } }, { longitude: { $exists: false } }]);
    if (cafes.length == 0)
        return null;
    return cafes;
});
const saveCoord = (cafe) => __awaiter(void 0, void 0, void 0, function* () {
    yield cafe.save();
    return;
});
const isCafeExists = (cafeId) => __awaiter(void 0, void 0, void 0, function* () {
    const cafe = yield Cafe_1.default.findById(cafeId);
    if (!cafe)
        return false;
    return true;
});
const updateCafeImage = (cafeId, url) => __awaiter(void 0, void 0, void 0, function* () {
    const cafe = yield Cafe_1.default.findById(cafeId);
    if (!cafe)
        return null;
    cafe.img = url;
    yield cafe.save();
    return cafe;
});
const getCafeByName = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const cafes = yield Cafe_1.default.find({ name: { $regex: `^${query}`, $options: "i" } });
    if (cafes.length == 0)
        return null;
    const cafeSearchDTOs = [];
    for (let cafe of cafes) {
        const cafeSearchDTO = {
            _id: cafe._id,
            name: cafe.name,
            address: cafe.address,
            latitude: cafe.latitude,
            longitude: cafe.longitude,
            img: cafe.img
        };
        cafeSearchDTOs.push(cafeSearchDTO);
    }
    return cafeSearchDTOs;
});
const getCafeAllList = (tags) => __awaiter(void 0, void 0, void 0, function* () {
    const tag_ids = yield Tag_1.default.find({
        'tagIdx': { $in: tags
        }
    }).select('_id');
    if (tags.length != tag_ids.length) {
        throw http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.INVALID_IDENTIFIER);
    }
    let tagList = [];
    for (let tag of tag_ids) {
        tagList.push(tag._id);
    }
    var cafes;
    //태그로 필터된 카페 리스트 조회
    if (tagList.length != 0) {
        cafes = yield Cafe_1.default.find().where('tags').all(tagList).populate("tags");
    }
    //쿼리에 태그 정보가 없으면 전체 카페 리스트 조회
    else {
        cafes = yield Cafe_1.default.find().populate("tags");
    }
    let cafeLocationList = [];
    for (let cafe of cafes) {
        let location = {
            _id: cafe._id,
            name: cafe.name,
            latitude: cafe.latitude,
            longitude: cafe.longitude,
            address: cafe.address,
            tags: cafe.tags,
            rating: cafe.rating
        };
        cafeLocationList.push(location);
    }
    if (cafeLocationList.length == 0) {
        return null;
    }
    return cafeLocationList;
});
const getMyMapCafeAllList = (userId, tags) => __awaiter(void 0, void 0, void 0, function* () {
    const tag_ids = yield Tag_1.default.find({
        'tagIdx': { $in: tags
        }
    }).select('_id');
    if (tags.length != tag_ids.length) {
        throw http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.INVALID_IDENTIFIER);
    }
    let tagList = [];
    for (let tag of tag_ids) {
        tagList.push(tag._id);
    }
    var mycafeList = [];
    //쿼리에 태그 정보가 없으면 전체 카페 리스트 조회
    if (tagList.length != 0) {
        mycafeList = yield Category_1.default.find({ user: userId }).populate({
            path: 'cafes',
            match: { tags: { $all: tagList } },
            select: "longitude latitude name address rating img",
            populate: {
                path: "tags"
            }
        }).select("cafes color name");
    }
    //태그로 필터된 카페 리스트 조회
    else {
        mycafeList = yield Category_1.default.find({ user: userId }).populate({
            path: 'cafes',
            select: 'longitude latitude name address rating img',
            populate: {
                path: "tags"
            }
        }).select("cafes color name");
    }
    let cafeList = [];
    for (let item of mycafeList) {
        // 카테고리에 카페가 1개 이상 있을 때만 push
        if (item.cafes.length > 0) {
            let info = {
                cafes: item.cafes,
                color: item.color,
                name: item.name
            };
            cafeList.push(info);
        }
    }
    if (cafeList.length == 0)
        return null;
    return cafeList;
});
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
};
//# sourceMappingURL=cafeService.js.map