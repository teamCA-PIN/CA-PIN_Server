import Review from "../models/Review";
import User from "../models/User";
import { IReviewOutputDTO } from "../interfaces/IReview";
import { IUserReviewDTO, IUser } from "../interfaces/IUser";
import mongoose from "mongoose";
import Cafeti from "../models/Cafeti";
const responseMessage = require("../modules/responseMessage");

const getCafeReviewList = async(cafeId) => {

    const reviews = await Review.find().where("cafe").equals(cafeId).populate("user",["_id", "nickname", "profileImg" ,"cafeti"]);
    let reviewDTOList: IReviewOutputDTO[] = []

    for (let review of reviews){
        if (!review.user.profileImg){
            review.user.profileImg = review.user.cafeti.img;
        }

        let reviewDTO: IReviewOutputDTO = {
            _id: review._id,
            cafe: review.cafe,
            user: review.user,
            rating: review.rating,
            created_at: review.created_at,
            content: review.content
        }
        if (review.imgs){
            reviewDTO.imgs = review.imgs
        }
        if (review.recommend){
            reviewDTO.recommend = review.recommend
        }
        reviewDTOList.push(reviewDTO);
    }
    
    if (reviewDTOList.length == 0){
        throw Error(responseMessage.NO_CONTENT);
    }

    return reviewDTOList;
}

const checkIfReviewed = async (cafeId,userId) => {
    const review = await Review.findOne({cafe:cafeId,user:userId})
    if (!review) return false;
    return true;
}

module.exports = {
    getCafeReviewList,
    checkIfReviewed
}